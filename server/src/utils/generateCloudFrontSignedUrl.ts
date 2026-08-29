
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const generateCloudFrontSignedUrl = (fileKey: string, expiresInSeconds: number = 3600) => {
    const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY!;

    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN!;
    const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID!;

    if (!keyPairId || !cloudfrontDomain || !privateKey) {
        throw new Error("Missing CloudFront configuration");
    } 

    // Clean file key - remove leading slash
    const cleanFileKey = fileKey.replace(/^\/+/, '');

    // Ensure domain has protocol and no trailing slash
    let domain = cloudfrontDomain.trim();
    domain = domain.replace(/\/+$/, '');

 
    const cloudfrontUrl = `${domain}/${cleanFileKey}`;


    // Format private key properly
    const formattedPrivateKey = privateKey
        .replace(/\\n/g, '\n')  // Handle escaped newlines
        .replace(/^"|"$/g, '');  // Remove surrounding quotes


    const signedUrl = getSignedUrl({
        url: cloudfrontUrl,
        keyPairId: keyPairId,
        dateLessThan: new Date(
            Date.now() + expiresInSeconds * 1000
        ).toISOString(),
        privateKey: formattedPrivateKey,
    });
    
    return signedUrl;

}

export default generateCloudFrontSignedUrl; 