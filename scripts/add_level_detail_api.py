from pathlib import Path
p=Path('worker/src/index.js')
s=p.read_text()
old='''        if (game_key) {
          const row = await db.prepare("SELECT game_key, COUNT(*) attempted_levels, COALESCE(SUM(correct),0) correct_levels, COALESCE(SUM(attempts),0) total_attempts FROM level_results WHERE child_id = ? AND game_key = ? GROUP BY game_key").bind(child_id, game_key).first();
          return json(row || { game_key, attempted_levels: 0, correct_levels: 0, total_attempts: 0 });
        }'''
new='''        if (game_key) {
          const detail = url.searchParams.get("detail");
          if (detail === "1") {
            const { results: levels } = await db.prepare("SELECT level, attempts, correct, last_correct, updated_at FROM level_results WHERE child_id = ? AND game_key = ? ORDER BY level ASC").bind(child_id, game_key).all();
            return json({ game_key, levels });
          }
          const row = await db.prepare("SELECT game_key, COUNT(*) attempted_levels, COALESCE(SUM(correct),0) correct_levels, COALESCE(SUM(attempts),0) total_attempts FROM level_results WHERE child_id = ? AND game_key = ? GROUP BY game_key").bind(child_id, game_key).first();
          return json(row || { game_key, attempted_levels: 0, correct_levels: 0, total_attempts: 0 });
        }'''
if old not in s: raise SystemExit('performance GET pattern not found')
p.write_text(s.replace(old,new))
