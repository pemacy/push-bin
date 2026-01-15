//const aws = require("aws-sdk");
import fs from "fs";
//
//const cloudfront = new aws.CloudFront.Signer(
//  "K1VAPTP4K9RKJQ", // from CloudFront console when you created the key
//  fs.readFileSync("private_key.pem", "utf8"),
//);
//
//const url = cloudfront.getSignedUrl({
//  url: "https://d129bbakqqfs1i.cloudfront.net/premium/IMG_4317.JPG", // your CloudFront URL
//  expires: Math.floor((Date.now() + 60 * 60 * 1000) / 1000), // 1 hour expiry
//});
//
//console.log("Signed URL:", url);

import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM
// const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS

const cloudfrontDistributionDomain = "https://d129bbakqqfs1i.cloudfront.net";
const s3ObjectKey = "premium/IMG_4317.JPG";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
const privateKey = fs.readFileSync("private_key.pem", "utf8");
const keyPairId = "K1VAPTP4K9RKJQ";
const dateLessThan = "2026-01-01"; // any Date constructor compatible

const signedUrl = getSignedUrl({
  url,
  keyPairId,
  dateLessThan,
  privateKey,
});

console.log(signedUrl);
