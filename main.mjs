import JsonWebToken from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import SuperTokensNode from 'supertokens-node';
import EmailPasswordNode from 'supertokens-node/recipe/emailpassword';
import SessionNode from 'supertokens-node/recipe/session';

const client = jwksClient({
    jwksUri: `https://try.supertokens.com/.well-known/jwks.json`,
});

async function main() {
    const appInfo = {
        appName: "supertokens-issue",
        apiDomain: "http://localhost:3000",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/api/auth",
        websiteBasePath: "/auth"
    }
    SuperTokensNode.init({
        framework: "custom",
        supertokens: {
            connectionURI: "https://try.supertokens.com",
        },
        appInfo,
        recipeList: [
            EmailPasswordNode.init(),
            SessionNode.init(),
        ],
        isInServerlessEnv: true,
    });

    const ret = await EmailPasswordNode.signUp('public', 'example@example.com', 'example-password');
    console.info('EmailPasswordNode.signUp:', ret);

    const superTokensUsers = await SuperTokensNode.listUsersByAccountInfo('public', {email: 'exkazuu@gmail.com'});
    console.info('superTokensUsers:', superTokensUsers);
    if (!superTokensUsers[0]) throw new Error('SuperTokens user not found.');

    const recipeUserId = superTokensUsers[0].loginMethods.find((lm) => lm.recipeId === 'emailpassword')?.recipeUserId;
    console.info('recipeUserId:', recipeUserId);
    if (!recipeUserId) throw new Error('EmailPassword recipe user not found.');

    const session = await SessionNode.createNewSessionWithoutRequestResponse('public', recipeUserId);
    const accessToken = session.getAccessToken();
    console.info('accessToken:', accessToken);

    const promise = new Promise((resolve, reject) => {
        JsonWebToken.verify(accessToken, getPublicKey, {}, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
    console.info('decoded:', await promise);
}

function getPublicKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err);
        } else {
            const signingKey = key?.getPublicKey();
            callback(null, signingKey);
        }
    });
}

await main();