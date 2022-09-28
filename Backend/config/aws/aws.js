const AWS = require("aws-sdk");
AWS.config.loadFromPath('./awsconfig.json');

// Create sendEmail params
const params = {
    Destination: { /* required */
        CcAddresses: [
            /* more items */
        ],
        ToAddresses: [
            'kjm0551@naver.com',
            /* more items */
        ]
    },
    Message: { /* required */
        Body: { /* required */
            Html: {
                Charset: "UTF-8",
                Data: "HTML_FORMAT_BODY"
            },
            Text: {
                Charset: "UTF-8",
                Data: "TEXT_FORMAT_BODY"
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Test email'
        }
    },
    Source: 'gmltjd6801@naver.com', /* required */
    ReplyToAddresses: [
        'gmltjd6801@naver.com',
        /* more items */
    ],
};

// Create the promise and SES service object
const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
    function(data) {
        console.log(data.MessageId);
    }).catch(
    function(err) {
        console.error(err, err.stack);
    });