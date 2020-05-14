// @flow
import Router, { type Context } from 'koa-router';
import fetch from 'isomorphic-fetch';
import { mountOAuth2Passport, type DeserializedData } from '../utils/passport';
import { customError } from '../errors';

/*
 * Mattermost integration
 * API reference: https://api.mattermost.com/v4/
 */

const mattermostUrl = process.env.MATTERMOST_URL || 'https://mattermost.com';
const clientId = process.env.MATTERMOST_CLIENT_ID;
const clientSecret = process.env.MATTERMOST_CLIENT_SECRET;

class NotAMemberOfATeam extends customError(
  'NotAMemberOfATeam',
  'notice=auth-error&error=state_mismatch' // TODO not sure what to put here
) {}

class TooManyTeams extends customError(
  'TooManyTeams',
  'notice=auth-error&error=state_mismatch' // TODO not sure what to put here
) {}

async function image(input, init) {
  const res = await fetch(input, init);
  const buffer = await res.buffer();
  return buffer.toString('base64');
}

async function json(
  input: string | Request | URL,
  init?: RequestOptions
): Promise<any> {
  const res = await fetch(input, init);
  return await res.json();
}

async function deserializeToken(
  accessToken,
  refreshToken: string
): Promise<DeserializedData> {
  const user = await json(`${mattermostUrl}/api/v4/users/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  const teams = await json(`${mattermostUrl}/api/v4/users/me/teams`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  // const userImage = await image(`${mattermostUrl}/api/v4/users/me/image`, {
  //   headers: {
  //     authorization: `Bearer ${accessToken}`,
  //   },
  // });

  if (teams.length <= 0) {
    throw new NotAMemberOfATeam();
  }

  if (teams.length > 1) {
    throw new TooManyTeams();
  }

  const team = teams[0];

  // const teamImage = await image(`${mattermostUrl}/api/v4/teams/${team.id}/image`, {
  //   headers: {
  //     authorization: `Bearer ${accessToken}`,
  //   },
  // });

  return {
    _user: {
      id: user.id,
      name: user.username,
      email: user.email,
      // avatarUrl: `data:image/png;base64, ${userImage}`,
    },
    _team: {
      id: team.id,
      name: team.name,
      // avatarUrl: `data:image/png;base64, ${teamImage}`,
    },
  };
}

async function handleAuthorizeFailed(ctx: Context, err: any) {
  if (err instanceof NotAMemberOfATeam) {
    ctx.redirect(`/?${err.name}`);
    return;
  }

  throw err;
}

const router = new Router();
if (clientId && clientSecret) {
  const [authorizeHandler, callbackHandlers] = mountOAuth2Passport(
    'mattermost',
    deserializeToken,
    {
      clientID: clientId,
      clientSecret: clientSecret,
      // could only find it here: https://github.com/mattermost/mattermost-developer-documentation/issues/415
      tokenURL: `${mattermostUrl}/oauth/access_token`,
      authorizationURL: `${mattermostUrl}/oauth/authorize`,
      scope: ['api'],
      column: 'slackId',
      authorizeFailedHook: [handleAuthorizeFailed],
    }
  );

  router.get('mattermost', authorizeHandler);
  router.get('mattermost.callback', ...callbackHandlers);
}

export default router;
