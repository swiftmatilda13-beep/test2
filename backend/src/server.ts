import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');

function readJsonFile(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJsonFile(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/yuanbao-info', (req, res) => {
  try {
    const data = readJsonFile('yuanbao-info.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read yuanbao info' });
  }
});

app.get('/api/product-knowledge', (req, res) => {
  try {
    const data = readJsonFile('product-knowledge.json');
    const category = req.query.category as string;
    if (category) {
      data.questions = data.questions.filter((q: any) => q.category === category);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read product knowledge' });
  }
});

app.get('/api/user-info', (req, res) => {
  try {
    const data = readJsonFile('user-info.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read user info' });
  }
});

app.put('/api/user-info', (req, res) => {
  try {
    writeJsonFile('user-info.json', req.body);
    res.json({ success: true, message: 'User info updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const userInfo = readJsonFile('user-info.json');
    const yuanbaoInfo = readJsonFile('yuanbao-info.json');
    const productKnowledge = readJsonFile('product-knowledge.json');

    const context = `
用户背景：
- 姓名：${userInfo.name || '未提供'}
- 教育背景：${userInfo.education || '未提供'}
- 实习经历：${JSON.stringify(userInfo.internships || [])}
- 项目经历：${JSON.stringify(userInfo.projects || [])}
- 目标岗位：${userInfo.targetPosition}
- 目标公司：${userInfo.targetCompany}

元宝公司信息：
${JSON.stringify(yuanbaoInfo, null, 2)}

产品知识库：
${JSON.stringify(productKnowledge, null, 2)}

用户问题：${message}

请基于以上信息，以产品经理面试辅导老师的身份回答。`;

    let response = '';
    
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一位专业的产品经理面试辅导老师，专门帮助用户准备银联商务-元宝的产品经理面试。请结合用户背景、元宝公司信息和产品知识提供专业的指导。' },
          { role: 'user', content: context }
        ]
      });
      
      response = completion.choices[0].message.content || '抱歉，我无法回答这个问题。';
    } else {
      response = `[演示模式] 收到你的问题："${message}"。\n\n要启用智能回答，请在 .env 文件中配置 OPENAI_API_KEY。\n\n同时，请先完善你的个人信息，这样我可以提供更个性化的辅导！`;
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
