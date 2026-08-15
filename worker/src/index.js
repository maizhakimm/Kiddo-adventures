function cors(resp) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return resp;
}

function json(data, status = 200) {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  }));
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function genToken() {
  return crypto.randomUUID();
}

function genAgentCode(name) {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 6) || "AGENT";
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KIDDO-${clean}${rand}`;
}

const AVATARS = ["panda", "kucing", "beruang", "arnab", "musang", "gajah"];

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

    const url = new URL(request.url);
    const path = url.pathname;
    const db = env.DB;

    try {
      if (path === "/api/signup" && request.method === "POST") {
        const { email, password, name, agent_code } = await request.json();
        if (!email || !password) return json({ error: "Email dan password diperlukan" }, 400);

        const existing = await db.prepare("SELECT id FROM parents WHERE email = ?").bind(email).first();
        if (existing) return json({ error: "Email sudah digunakan" }, 409);

        const password_hash = await hashPassword(password);
        const result = await db
          .prepare("INSERT INTO parents (email, password_hash, name, referred_by_agent_code) VALUES (?, ?, ?, ?)")
          .bind(email, password_hash, name || "", agent_code || null)
          .run();

        const parentId = result.meta.last_row_id;

        if (agent_code) {
          const agent = await db.prepare("SELECT agent_code FROM agents WHERE agent_code = ? AND status = 'active'").bind(agent_code).first();
          if (agent) {
            await db.prepare(
              "INSERT INTO referrals (agent_code, parent_id, subscription_amount, commission_amount, payout_status) VALUES (?, ?, 0, 0, 'pending')"
            ).bind(agent_code, parentId).run();
          }
        }

        return json({ token: genToken(), parent_id: parentId, email, name, subscription_status: "inactive" });
      }

      if (path === "/api/login" && request.method === "POST") {
        const { email, password } = await request.json();
        const password_hash = await hashPassword(password);
        const parent = await db
          .prepare("SELECT id, email, name, subscription_status FROM parents WHERE email = ? AND password_hash = ?")
          .bind(email, password_hash)
          .first();
        if (!parent) return json({ error: "Email atau password salah" }, 401);
        return json({ token: genToken(), ...parent });
      }

      if (path === "/api/child-profiles" && request.method === "POST") {
        const { parent_id, name, age, avatar } = await request.json();
        if (!parent_id || !name || !age) return json({ error: "parent_id, name, age diperlukan" }, 400);

        const countRow = await db.prepare("SELECT COUNT(*) as c FROM child_profiles WHERE parent_id = ?").bind(parent_id).first();
        if (countRow.c >= 5) return json({ error: "Maksimum 5 profil anak sudah dicapai" }, 400);

        const chosenAvatar = AVATARS.includes(avatar) ? avatar : AVATARS[countRow.c % AVATARS.length];

        const result = await db
          .prepare("INSERT INTO child_profiles (parent_id, name, age, avatar) VALUES (?, ?, ?, ?)")
          .bind(parent_id, name, age, chosenAvatar)
          .run();

        return json({ id: result.meta.last_row_id, name, age, avatar: chosenAvatar });
      }

      if (path === "/api/child-profiles" && request.method === "GET") {
        const parent_id = url.searchParams.get("parent_id");
        if (!parent_id) return json({ error: "parent_id diperlukan" }, 400);
        const { results } = await db
          .prepare("SELECT id, name, age, avatar, created_at FROM child_profiles WHERE parent_id = ? ORDER BY created_at ASC")
          .bind(parent_id)
          .all();
        return json({ profiles: results });
      }

      if (path.startsWith("/api/child-profiles/") && request.method === "PUT") {
        const id = path.split("/").pop();
        const { parent_id, name, age, avatar } = await request.json();
        if (!parent_id || !name || !age) return json({ error: "parent_id, name, age diperlukan" }, 400);
        const chosenAvatar = AVATARS.includes(avatar) ? avatar : "panda";
        const existing = await db.prepare("SELECT id FROM child_profiles WHERE id = ? AND parent_id = ?").bind(id, parent_id).first();
        if (!existing) return json({ error: "Profil anak tidak dijumpai" }, 404);
        await db.prepare("UPDATE child_profiles SET name = ?, age = ?, avatar = ? WHERE id = ? AND parent_id = ?")
          .bind(name, age, chosenAvatar, id, parent_id)
          .run();
        return json({ updated: true, id: Number(id), name, age, avatar: chosenAvatar });
      }

      if (path.startsWith("/api/child-profiles/") && request.method === "DELETE") {
        const id = path.split("/").pop();
        await db.prepare("DELETE FROM game_progress WHERE child_id = ?").bind(id).run();
        await db.prepare("DELETE FROM child_profiles WHERE id = ?").bind(id).run();
        return json({ deleted: true });
      }

      if (path === "/api/games" && request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM games").all();
        return json({ games: results });
      }

      if (path === "/api/progress" && request.method === "GET") {
        const child_id = url.searchParams.get("child_id");
        if (!child_id) return json({ error: "child_id diperlukan" }, 400);
        const { results } = await db.prepare("SELECT * FROM game_progress WHERE child_id = ?").bind(child_id).all();
        return json({ progress: results });
      }

      if (path === "/api/progress" && request.method === "POST") {
        const { child_id, game_key, level_reached, stars } = await request.json();
        if (!child_id || !game_key) return json({ error: "child_id, game_key diperlukan" }, 400);

        const existing = await db
          .prepare("SELECT id, level_reached, stars FROM game_progress WHERE child_id = ? AND game_key = ?")
          .bind(child_id, game_key)
          .first();

        if (existing) {
          const newLevel = Math.max(existing.level_reached, level_reached || existing.level_reached);
          const newStars = Math.max(existing.stars, stars || existing.stars);
          await db
            .prepare("UPDATE game_progress SET level_reached = ?, stars = ?, last_played = CURRENT_TIMESTAMP WHERE id = ?")
            .bind(newLevel, newStars, existing.id)
            .run();
          return json({ updated: true, level_reached: newLevel, stars: newStars });
        } else {
          await db
            .prepare("INSERT INTO game_progress (child_id, game_key, level_reached, stars) VALUES (?, ?, ?, ?)")
            .bind(child_id, game_key, level_reached || 1, stars || 0)
            .run();
          return json({ created: true });
        }
      }

      if (path === "/api/agents" && request.method === "POST") {
        const { name, email, phone, bank_name, bank_account } = await request.json();
        if (!name || !email) return json({ error: "name, email diperlukan" }, 400);

        const existing = await db.prepare("SELECT id FROM agents WHERE email = ?").bind(email).first();
        if (existing) return json({ error: "Email agent sudah wujud" }, 409);

        const agent_code = genAgentCode(name);
        await db
          .prepare("INSERT INTO agents (agent_code, name, email, phone, bank_name, bank_account) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(agent_code, name, email, phone || "", bank_name || "", bank_account || "")
          .run();

        return json({ agent_code, name, email });
      }

      if (path.startsWith("/api/agents/") && path.endsWith("/dashboard") && request.method === "GET") {
        const agent_code = decodeURIComponent(path.split("/")[3]);
        const agent = await db.prepare("SELECT * FROM agents WHERE agent_code = ?").bind(agent_code).first();
        if (!agent) return json({ error: "Agent tidak dijumpai" }, 404);

        const { results: referrals } = await db
          .prepare("SELECT * FROM referrals WHERE agent_code = ? ORDER BY created_at DESC")
          .bind(agent_code)
          .all();

        const totalEarned = referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0);
        const totalPaid = referrals.filter((r) => r.payout_status === "paid").reduce((sum, r) => sum + r.commission_amount, 0);
        const totalPending = totalEarned - totalPaid;

        return json({
          agent: { name: agent.name, agent_code: agent.agent_code, commission_rate: agent.commission_rate },
          summary: { total_referrals: referrals.length, total_earned: totalEarned, total_paid: totalPaid, total_pending: totalPending },
          referrals,
        });
      }

      if (path === "/api/subscriptions/confirm" && request.method === "POST") {
        const { parent_id, amount, plan, agent_code } = await request.json();
        if (!parent_id || !amount) return json({ error: "parent_id, amount diperlukan" }, 400);

        await db
          .prepare("UPDATE parents SET subscription_status = 'active', subscription_plan = ? WHERE id = ?")
          .bind(plan || "lifetime", parent_id)
          .run();

        if (agent_code) {
          const agent = await db.prepare("SELECT commission_rate FROM agents WHERE agent_code = ?").bind(agent_code).first();
          if (agent) {
            const commission = amount * agent.commission_rate;
            const pendingReferral = await db
              .prepare("SELECT id FROM referrals WHERE agent_code = ? AND parent_id = ? AND subscription_amount = 0")
              .bind(agent_code, parent_id)
              .first();
            if (pendingReferral) {
              await db
                .prepare("UPDATE referrals SET subscription_amount = ?, commission_amount = ? WHERE id = ?")
                .bind(amount, commission, pendingReferral.id)
                .run();
            } else {
              await db
                .prepare("INSERT INTO referrals (agent_code, parent_id, subscription_amount, commission_amount) VALUES (?, ?, ?, ?)")
                .bind(agent_code, parent_id, amount, commission)
                .run();
            }
          }
        }

        return json({ confirmed: true });
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
