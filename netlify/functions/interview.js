// Netlify Function for AI Interview API
// This function handles interview sessions with GLM AI model

// 安全提示：API Key 必须通过环境变量配置，禁止硬编码
// 在Netlify平台配置环境变量 API_KEY
const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("错误：未配置 API_KEY 环境变量");
  }
  return apiKey;
};

const MODEL = 'glm-4-flash';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// HR面试官配置
const hrConfigs = {
  tech: { name: "互联网/科技行业", hrType: "HRBP", focus: "业务理解、数据分析、项目落地能力" },
  manufacturing: { name: "制造业/实体工业", hrType: "综合人事经理", focus: "法规知识、实操经验、细节管理" },
  finance: { name: "金融行业", hrType: "HR总监", focus: "合规意识、风险控制、专业判断" },
  retail: { name: "消费品/零售/连锁", hrType: "区域HR总监", focus: "执行力、抗压能力、多任务处理" },
  consulting: { name: "咨询/专业服务", hrType: "HR合伙人", focus: "专业深度、思维逻辑、客户意识" },
  education: { name: "教育/培训行业", hrType: "人事主任", focus: "教学能力、沟通表达、教育情怀" }
};

// 经验等级
const experienceNames = {
  beginner: "应届生/实习",
  junior: "1-3年经验",
  mid: "3-5年经验",
  senior: "5-10年经验",
  expert: "10年以上经验"
};

// 存储会话（简单内存存储，生产环境应使用数据库）
const sessions = new Map();

// 生成系统提示
function generateSystemPrompt(industry, position, userExperience) {
  const hrConfig = hrConfigs[industry] || hrConfigs.tech;
  const expName = experienceNames[userExperience] || userExperience;
  
  return `你是一位资深的${hrConfig.name}${hrConfig.hrType}，正在进行模拟面试。

【面试官设定】
- 你有15年+的${hrConfig.name}人力资源管理经验
- 你的面试风格专业、友善但有深度
- 你擅长考察候选人的${hrConfig.focus}

【面试职位】
- 应聘岗位：${position}
- 候选人经验：${expName}

【面试规则】
1. 每次只问一个问题，等待候选人回答后再继续
2. 问题要有层次：先了解基本情况，再深入专业能力，最后考察软技能
3. 根据候选人回答的质量决定追问深度
4. 如果候选人的回答模糊，礼貌地追问具体细节
5. 面试控制在8-12个问题左右
6. 当你觉得已经充分了解候选人时，给出面试结束的信号，说"感谢你参加今天的面试，我们会尽快通知你结果。"

【开场白】
用简短友好的方式开场，介绍自己，然后开始第一个问题。

现在请开始面试。`;
}

// 调用GLM API
async function callGLMAPI(messages) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('服务配置错误：未配置API Key，请在Netlify环境变量中设置 API_KEY');
  }
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API调用失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 处理请求
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { action, industry, position, userExperience, message, sessionId } = body;

    // 开始新面试
    if (action === 'start') {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const systemPrompt = generateSystemPrompt(industry, position, userExperience);
      
      const messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      // 获取开场白
      const aiMessage = await callGLMAPI(messages);
      messages.push({ role: 'assistant', content: aiMessage });
      
      // 存储会话
      sessions.set(newSessionId, {
        industry,
        position,
        userExperience,
        messages,
        createdAt: Date.now()
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          sessionId: newSessionId,
          message: aiMessage
        })
      };
    }

    // 继续对话
    if (action === 'chat') {
      const session = sessions.get(sessionId);
      
      if (!session) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: '会话不存在或已过期' })
        };
      }

      // 添加用户消息
      session.messages.push({ role: 'user', content: message });
      
      // 获取AI回复
      const aiMessage = await callGLMAPI(session.messages);
      session.messages.push({ role: 'assistant', content: aiMessage });
      
      // 检查是否面试结束
      const ended = aiMessage.includes('感谢你参加今天的面试') || 
                    aiMessage.includes('面试结束') ||
                    aiMessage.includes('会尽快通知你结果');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: aiMessage,
          ended
        })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: '无效的操作' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || '服务器内部错误' 
      })
    };
  }
};
