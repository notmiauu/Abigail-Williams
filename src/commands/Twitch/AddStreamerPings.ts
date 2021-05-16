import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class AddStreamerPing extends Command {
    public constructor() {
        super('addstreamerping', {
            aliases: ['addstreamerping', 'addstreampings', 'addstreamping'],
            category: 'Twitch',
            description: {
                content: 'Add a role ping for streamers on the watchlist.',
                usage: 'addstreamping [streamer] [role]',
                examples: ['addstreamping notmiauu everyone', 'addstreamping notmiauu @role'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'streamer',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'role',
                    type: 'role'
                }
            ]
        })
    }

    public async exec(message: Message, {streamer, role}: {streamer: string, role: Role}): Promise<Message> {
        if (!streamer) return message.util!.send('Please provide a streamer to add a ping for.')
        if (!role) return message.util!.send('Ehm... you need a valid role to provide as a ping.')

        const twitchUsers: { 
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])

        if (!twitchUsers || twitchUsers.length === 0) return message.util!.send('You need to add streamers onto the watchlist to assign role pings.')

        const serverPings = twitchUsers.findIndex(s => s.name === streamer)

        if (serverPings === -1) return message.util!.send('This streamer is not on the watchlist.')

        if (twitchUsers[serverPings].pings.includes(role.id) || twitchUsers[serverPings].pings.includes(role.name))
            return message.util!.send('This role is already on the mentions list.')
        else {
            role !== message.guild.roles.everyone ? twitchUsers[serverPings].pings.push(role.id) : twitchUsers[serverPings].pings.push('@everyone')
            this.client.settings.set(message.guild, 'twitch.twitch-streamers', twitchUsers)
            return message.util!.send('Role has been successfully added to the mention list of this streamer!')
        }
    }
}