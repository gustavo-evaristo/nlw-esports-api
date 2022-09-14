import { Router} from 'express';
import { ad, game } from './database';
import { convertHourStringToMinutes, convertMinutesToHourString } from './utils';

const routes = Router();

routes.get('/games', async (req, res) => {
	const games = await game.findMany({
		include: {
			_count: {
				select: {
					Ads: true
				}
			},
		}
	});

	return res.status(200).json(games);
});

routes.get('/games/:id/ads', async (req, res) => {

	const gameId = req.params.id;

	const ads = await ad.findMany({
		where: { gameId },
		select: {
			id: true,
			name: true,
			weekDays: true,
			useVoiceChannel: true,
			yearsPlaying: true,
			hourStart: true,
			hourEnd: true
		},
		orderBy: {
			created_at: 'asc'
		}
	});

	const formattedAds = ads.map(ad => ({
		...ad,
		weekDays: ad.weekDays.split(','),
		hourStart: convertMinutesToHourString(ad.hourStart),
		hourEnd: convertMinutesToHourString(ad.hourEnd),
	}));

	return res.status(200).json(formattedAds);
});

routes.get('/ads/:id/discord', async (req, res) => {

	const { id } = req.params;

	const ads = await ad.findUnique({
		where: { id },
		select: {
			discord: true,
		}
	});


	return res.status(200).json(ads);
});

routes.post('/games/:gameId/ads', async (req, res) => {

	const { gameId }= req.params;

	const { name, yearsPlaying, discord, weekDays, hourStart, hourEnd, useVoiceChannel } = req.body;

	const ads = await ad.create({
		data: {
			name,
			gameId,
			yearsPlaying,
			discord, 
			weekDays: weekDays.join(','),  
			hourStart: convertHourStringToMinutes(hourStart),
			hourEnd: convertHourStringToMinutes(hourEnd),
			useVoiceChannel
		}
	});

	return res.status(200).json(ads);
});

export { routes };
