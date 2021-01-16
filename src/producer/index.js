const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost:5672', (error, connection) => {
  if (error) { console.error(error) }

  connection.createChannel((error, channel) => {
    if (error) { console.error(error) }

    channel.assertQueue('send-message', { durable: true })
    let iterator = 0

    while (iterator < 10) {
      const message = {
        user: {
          id: iterator + 1, name: `Usuário ${iterator + 1}`
        }
      }

      setTimeout(async () => {
        channel.sendToQueue('send-message', Buffer.from(JSON.stringify(message)), { persistent: true })
      }, 1000)

      channel.assertQueue('response-message', { durable: true })
      channel.consume('response-message', message => {
        console.log('RESPONSE PRODUCER RABBIT: ', String(message.content))
      }, { noAck: false })

      iterator++
    }
  })
})
