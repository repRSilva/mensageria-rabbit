
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost:5672', (error, connection) => {
  if (error) { console.error(error) }

  connection.createChannel((error, channel) => {
    if (error) { console.error(error) }

    channel.assertQueue('send-message', { durable: true })
    channel.prefetch()

    channel.consume('send-message', message => {
      console.log('CONSUMER RABBIT: ', String(message.content))

      const payload = JSON.parse(message.content)
      const msg = { value: `${payload.user.name} criado com sucesso!` }

      channel.sendToQueue('response-message', Buffer.from(JSON.stringify(msg)), { persistent: true })
    }, { noAck: false })
  })
})
