import { NextResponse } from 'next/server';

// Это ваш путь к данным
const API_URL = 'https://csgo-gsi-server.vercel.app/api/latest';

export async function GET() {
  try {
    // Запрос на получение данных
    const res = await fetch(API_URL);
    const data = await res.json();

    // Если нет данных, возвращаем 404
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    // Формируем нужный ответ
    const responseData = data.map(match => {
      return {
        map: match.map.name,
        phase: match.map.phase,
        round: match.map.round,
        teams: {
          ct: {
            name: match.map.team_ct.name,
            score: match.map.team_ct.score
          },
          t: {
            name: match.map.team_t.name,
            score: match.map.team_t.score
          }
        },
        players: match.allplayers.map(player => ({
          steamid: player.steamid,
          name: player.name,
          team: player.team,
          kills: player.match_stats.kills,
          deaths: player.match_stats.deaths,
          score: player.match_stats.score,
          weapons: player.weapons.map(weapon => weapon.name),
        }))
      };
    });

    // Возвращаем данные в JSON формате
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}
