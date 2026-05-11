import express from 'express'
import { getDb } from '../models/database.js'

const router = express.Router()

router.post('/webhook', async (req, res) => {
  try {
    const { challenge, event } = req.body
    
    if (challenge) {
      return res.json({ challenge })
    }

    if (event && event.type === 'im.message.receive_v1') {
      const message = event.message
      const content = JSON.parse(message.content)
      
      console.log('Received Feishu message:', content)
      
      res.json({ success: true })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error handling Feishu webhook:', error)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
})

router.post('/send', async (req, res) => {
  try {
    const { user_id, message } = req.body
    
    const feishuAppId = process.env.FEISHU_APP_ID
    const feishuAppSecret = process.env.FEISHU_APP_SECRET
    
    if (!feishuAppId || !feishuAppSecret || feishuAppId === 'your_feishu_app_id') {
      return res.status(400).json({ 
        success: false, 
        error: 'Feishu not configured. Please set FEISHU_APP_ID and FEISHU_APP_SECRET in .env' 
      })
    }

    const tokenResponse = await fetch(`https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: feishuAppId, app_secret: feishuAppSecret })
    })
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.tenant_access_token

    await fetch(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=user_id`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receive_id: user_id,
        msg_type: 'text',
        content: JSON.stringify({ text: message })
      })
    })

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error sending Feishu message:', error)
    res.status(500).json({ success: false, error: 'Failed to send message' })
  }
})

router.get('/config', (req, res) => {
  const configured = process.env.FEISHU_APP_ID && 
                     process.env.FEISHU_APP_ID !== 'your_feishu_app_id'
  
  res.json({ 
    success: true, 
    data: { 
      configured,
      message: configured ? 'Feishu integration is configured' : 'Please configure Feishu in .env'
    }
  })
})

export default router
