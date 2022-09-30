const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + '/awsconfig.json');
// Create sendEmail params
module.exports = {
    awsEMail: (email, randomValue) => {
        const params = {
            Destination: { /* required */
                CcAddresses: [
                    /* more items */
                ],
                ToAddresses: [
                    email,
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    Text: {
                        Charset: "UTF-8",
                        Data: "이메일 인증번호는 " + randomValue + " 입니다."
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
    }
}
