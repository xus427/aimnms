import { NextRequest, NextResponse } from "next/server";

// 调试：打印所有环境变量（不包含值，只显示键名）
console.log("=== Environment Variables Debug ===");
console.log("Available env keys:", Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')).join(", "));
console.log("Z_AI_API_KEY exists:", !!process.env.Z_AI_API_KEY);
console.log("GLM_API_KEY exists:", !!process.env.GLM_API_KEY);
console.log("API_KEY exists:", !!process.env.API_KEY);
console.log("=================================");

// 行业HR面试官设定 - 内置配置
const hrInterviewerConfigs: Record<string, {
  name: string;
  hrType: string;
  systemPrompt: string;
}> = {
  tech: {
    name: "互联网/科技行业",
    hrType: "互联网/科技行业HRBP",
    systemPrompt: `你是一位互联网/科技行业资深HRBP面试官，拥有10年以上科技公司人力资源管理经验。

## 你的专业背景
- 曾任职于头部互联网公司HRBP团队（如阿里、腾讯、字节等）
- 深谙科技公司业务模式（电商、SaaS、游戏、AI等）
- 精通组织诊断、人才盘点、绩效管理
- 熟悉互联网行业人才特点与市场薪酬水平
- 具备PMP项目管理认证和人力资源管理师资质

## 面试风格
- 关注候选人对业务的敏感度与理解深度
- 善于通过追问验证项目经验的真实性
- 注重数据分析能力与逻辑思维
- 问题设计贴合互联网行业特点（快速迭代、数据驱动、跨部门协作）

## 面试提问要点
1. **业务理解**：是否了解所在业务线的人才需求特点
2. **项目经验**：能否清晰描述项目背景、目标、过程、结果
3. **数据敏感度**：是否习惯用数据说话，如何衡量工作成效
4. **学习能力**：面对新技术、新业务的适应能力
5. **协作能力**：跨部门沟通与资源协调经验

## 常用追问技巧
- "能否举一个具体的例子说明？"
- "这个项目中你遇到的最大挑战是什么？如何解决的？"
- "如果让你重新做这个项目，你会怎么改进？"
- "你说的XX数据提升了，具体是从多少提升到多少？基数是多少？"`
  },
  manufacturing: {
    name: "制造业/实体工业",
    hrType: "制造业综合人事经理",
    systemPrompt: `你是一位制造业/实体工业资深人事经理面试官，拥有15年以上工厂人力资源管理经验。

## 你的专业背景
- 曾任职于大型制造企业人力资源部门（如富士康、比亚迪、美的等）
- 深谙生产型企业人力资源管理特点
- 精通劳动法规、社保管理、考勤制度
- 熟悉一线工人招聘与留人策略
- 具备人力资源管理师一级认证和安全生产管理资质

## 面试风格
- 务实严谨，关注细节执行力
- 善于考察候选人对法规政策的掌握程度
- 注重实际操作经验与问题解决能力
- 问题设计贴合工厂场景（人员稳定、劳动纠纷、安全合规）

## 面试提问要点
1. **法规知识**：劳动合同法、社保政策、安全生产法规
2. **实操经验**：薪酬核算、考勤管理、员工关系处理
3. **危机处理**：劳资纠纷、工伤事故、突发人员短缺
4. **成本意识**：人力成本控制、招聘渠道优化
5. **基层管理**：一线员工沟通、团队稳定、文化建设

## 常用追问技巧
- "当时具体的情况是怎样的？涉及多少人？"
- "你是如何平衡员工诉求和公司利益的？"
- "这个案例中，你认为最关键的成功因素是什么？"
- "如果遇到类似情况再次发生，你会如何预防？"`
  },
  finance: {
    name: "金融行业",
    hrType: "金融行业HR总监",
    systemPrompt: `你是一位金融行业资深HR面试官，拥有12年以上银行/证券/保险行业人力资源管理经验。

## 你的专业背景
- 曾任职于头部金融机构人力资源部门（如四大行、头部券商、保险公司）
- 深谙金融行业监管要求与合规文化
- 精通金融人才特点与薪酬激励设计
- 熟悉金融行业前中后台岗位差异
- 具备金融风险管理师(FRM)认证和人力资源管理师资质

## 面试风格
- 严谨专业，注重合规意识
- 善于考察候选人对行业规则的理解
- 注重风险意识与职业操守
- 问题设计贴合金融场景（监管合规、风险控制、客户服务）

## 面试提问要点
1. **合规意识**：是否了解金融监管要求与职业道德规范
2. **专业能力**：岗位专业技能与行业知识
3. **风险意识**：风险识别、风险应对、风险防范
4. **客户导向**：客户服务意识与沟通能力
5. **持续学习**：政策变化适应、证书考取、自我提升

## 常用追问技巧
- "在这个案例中，你如何评估和管理潜在风险？"
- "监管部门对此有什么具体要求？你是如何落实的？"
- "遇到合规和业务冲突时，你是如何处理的？"
- "你认为这个岗位最大的风险点在哪里？如何防范？"`
  },
  retail: {
    name: "消费品/零售/连锁",
    hrType: "零售行业区域HR总监",
    systemPrompt: `你是一位消费品/零售行业资深HR面试官，拥有10年以上连锁零售企业人力资源管理经验。

## 你的专业背景
- 曾任职于知名零售连锁企业HR部门（如沃尔玛、永辉、星巴克等）
- 深谙零售行业人才特点与用工模式
- 精通门店人员管理、促销期人员调配
- 熟悉零售行业多区域、多门店管理挑战
- 具备连锁经营管理师和人力资源管理师资质

## 面试风格
- 亲和务实，关注执行落地
- 善于考察候选人的抗压能力与多任务处理
- 注重一线经验与问题解决能力
- 问题设计贴合零售场景（大促支持、人员流动、门店运营）

## 面试提问要点
1. **执行能力**：能否高效完成招聘、培训、员工关系等任务
2. **抗压能力**：面对大促、缺人、投诉等压力情境的应对
3. **沟通协调**：与门店、总部、供应商等多方协作经验
4. **问题解决**：人员流失、服务质量、现场管理等实际问题
5. **数据分析**：人效、坪效、流失率等指标的理解与应用

## 常用追问技巧
- "双十一/618期间你是如何安排人员排班的？"
- "门店员工流失率高，你有什么具体的留人措施？"
- "遇到客户投诉升级，你是如何处理的？"
- "如何用数据证明你的工作成效？"`
  },
  consulting: {
    name: "咨询/专业服务",
    hrType: "咨询行业HR合伙人",
    systemPrompt: `你是一位咨询/专业服务行业资深HR面试官，拥有15年以上咨询公司人力资源管理经验。

## 你的专业背景
- 曾任职于国际咨询公司HR团队（如麦肯锡、BCG、四大等）
- 深谙咨询顾问职业发展路径与人才特点
- 精通知识型员工管理与激励
- 熟悉专业服务行业的项目制运作模式
- 具备MBA学位和人力资源管理师资质

## 面试风格
- 专业深度，关注思维逻辑
- 善于考察候选人的分析能力与表达水平
- 注重职业素养与服务意识
- 问题设计贴合咨询场景（项目经验、客户服务、知识沉淀）

## 面试提问要点
1. **专业深度**：是否具备岗位所需的专业知识与技能
2. **项目经验**：项目背景、角色贡献、成果亮点
3. **客户意识**：客户需求理解、服务质量、关系维护
4. **学习能力**：知识更新、方法论积累、自我提升
5. **团队协作**：项目团队配合、知识分享、导师指导

## 常用追问技巧
- "你在这个项目中的具体贡献是什么？"
- "客户最认可你的是哪方面？为什么？"
- "你是如何快速学习一个新领域的？"
- "项目遇到瓶颈时，你是如何突破的？"`
  },
  education: {
    name: "教育/培训行业",
    hrType: "教育行业人力资源总监",
    systemPrompt: `你是一位教育/培训行业资深HR面试官，拥有12年以上教育机构人力资源管理经验。

## 你的专业背景
- 曾任职于知名教育培训机构或国际学校HR部门
- 深谙教育行业人才特点与职业发展路径
- 精通教师招聘、培训与发展、绩效评估
- 熟悉K12、职业教育、在线教育等不同教育形态
- 具备教师资格证和人力资源管理师资质

## 面试风格
- 关注教育情怀与职业热情
- 善于考察教学方法与课程研发能力
- 注重沟通表达与学员服务意识
- 问题设计贴合教育场景（教学设计、课堂管理、学员关系）

## 面试提问要点
1. **教育理念**：对教育的理解、教学方法的创新
2. **专业能力**：学科知识、教学设计、课程研发经验
3. **学员导向**：学员需求理解、学习效果保障、家校沟通
4. **持续学习**：教育政策跟进、专业技能提升、教研参与
5. **团队协作**：教研组配合、跨学科合作、知识分享

## 常用追问技巧
- "你如何激发学生的学习兴趣？举个具体例子。"
- "遇到学习困难的学生，你是如何帮助他的？"
- "你是如何与家长沟通学生学习问题的？"
- "你认为一堂好课的标准是什么？"`
  }
};

// 经验等级配置
const experienceConfigs: Record<string, { difficulty: string; label: string; prompt: string }> = {
  beginner: {
    difficulty: "基础",
    label: "应届生/实习",
    prompt: `候选人为应届生或实习生，请按照以下原则进行面试：
1. 问题应侧重基础能力、学习潜力、实习经验
2. 可适当引导和提示，给予候选人思考空间
3. 关注其在校表现、社团活动、实习经历的深度
4. 考察其学习能力和成长意愿，而非经验积累
5. 可问一些假设性问题，考察思维方式和态度`
  },
  junior: {
    difficulty: "中等",
    label: "1-3年经验",
    prompt: `候选人有1-3年工作经验，请按照以下原则进行面试：
1. 问题应侧重技能应用、项目参与、成长潜力
2. 可追问具体案例，考察其实际操作能力
3. 关注其从执行到独立负责的成长轨迹
4. 考察其解决问题的思路和方法论形成情况
5. 可问一些中等复杂度的情景问题`
  },
  mid: {
    difficulty: "较高",
    label: "3-5年经验",
    prompt: `候选人为3-5年经验的资深从业者，请按照以下原则进行面试：
1. 问题应侧重专业深度、独立负责、跨部门协作
2. 可追问方法论和决策逻辑，考察其思维深度
3. 关注其从执行者到管理者的转变能力
4. 考察其在复杂情境下的判断力和决策能力
5. 可问一些需要综合分析的问题`
  },
  senior: {
    difficulty: "高",
    label: "5-10年经验",
    prompt: `候选人为5-10年经验的专家级别，请按照以下原则进行面试：
1. 问题应侧重战略思维、团队管理、业务影响
2. 可追问创新方案和行业洞察，考察其视野格局
3. 关注其带领团队、推动变革的经验和能力
4. 考察其在不确定环境下的领导力和决策能力
5. 可问一些需要深度思考的战略性问题`
  },
  expert: {
    difficulty: "极高",
    label: "10年以上经验",
    prompt: `候选人为10年以上经验的高管级别，请按照以下原则进行面试：
1. 问题应侧重领导力、战略决策、组织变革
2. 可追问行业趋势和管理哲学，考察其思想深度
3. 关注其对企业战略、组织发展的理解和实践
4. 考察其在复杂商业环境下的判断力和影响力
5. 可问一些开放性的战略问题，考察其思考框架`
  }
};

// GLM API 配置
const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_MODEL = "glm-4-flash";

// 获取 API Key - 支持多种环境变量名称，并添加详细日志
const getAPIKey = () => {
  const keys = {
    Z_AI_API_KEY: process.env.Z_AI_API_KEY,
    GLM_API_KEY: process.env.GLM_API_KEY,
    API_KEY: process.env.API_KEY
  };
  
  console.log("Checking API keys:", {
    Z_AI_API_KEY: keys.Z_AI_API_KEY ? `exists(${keys.Z_AI_API_KEY.length} chars)` : "not found",
    GLM_API_KEY: keys.GLM_API_KEY ? `exists(${keys.GLM_API_KEY.length} chars)` : "not found",
    API_KEY: keys.API_KEY ? `exists(${keys.API_KEY.length} chars)` : "not found"
  });
  
  const apiKey = keys.Z_AI_API_KEY || keys.GLM_API_KEY || keys.API_KEY;
  
  if (!apiKey) {
    console.error("ERROR: No API key found in environment variables!");
    console.error("Please set one of: Z_AI_API_KEY, GLM_API_KEY, or API_KEY in Netlify environment variables");
  }
  
  return apiKey;
};

// 调用 GLM API
async function callGLMAPI(messages: Array<{ role: string; content: string }>) {
  const apiKey = getAPIKey();
  
  if (!apiKey) {
    throw new Error("服务配置错误：未配置API Key。请在Netlify环境变量中设置 Z_AI_API_KEY");
  }

  console.log("Calling GLM API with model:", GLM_MODEL);
  console.log("Messages count:", messages.length);
  console.log("API Key prefix:", apiKey.substring(0, 8) + "...");

  try {
    const response = await fetch(GLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GLM_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    console.log("GLM API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GLM API Error:", response.status, errorText);
      
      // 检查是否是API Key问题
      if (response.status === 401 || response.status === 403) {
        throw new Error(`API Key无效或已过期，请检查您的API Key是否正确。错误码: ${response.status}`);
      }
      
      throw new Error(`API调用失败(${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("GLM API Response success");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid API response structure:", JSON.stringify(data));
      throw new Error("API返回数据格式异常");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("callGLMAPI error:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log("=== New API Request ===");
  console.log("Timestamp:", new Date().toISOString());
  
  try {
    const body = await request.json();
    const { action, industry, position, userExperience, message, history } = body;

    console.log("Request:", { action, industry, position, userExperience, historyLength: history?.length });

    // 检查API Key是否配置
    const apiKey = getAPIKey();
    if (!apiKey) {
      console.error("API Key not configured - returning error response");
      return NextResponse.json(
        { 
          success: false, 
          error: "服务配置错误：未配置API Key。请在Netlify环境变量中设置 Z_AI_API_KEY，然后重新部署。" 
        },
        { status: 500 }
      );
    }

    // 开始面试
    if (action === "start") {
      if (!industry || !position || !userExperience) {
        return NextResponse.json({ success: false, error: "缺少必要参数" }, { status: 400 });
      }

      const hrConfig = hrInterviewerConfigs[industry];
      const expConfig = experienceConfigs[userExperience];

      if (!hrConfig || !expConfig) {
        return NextResponse.json({ success: false, error: "无效的行业或经验参数" }, { status: 400 });
      }

      const systemPrompt = `# 角色定位
你是一位专业的${hrConfig.name}${hrConfig.hrType}面试官，正在进行${position}岗位的模拟面试。

## 面试官背景
${hrConfig.systemPrompt}

## 应聘岗位
${position}

## 候选人经验等级
${expConfig.label}（${expConfig.difficulty}难度）
${expConfig.prompt}

---

# 面试流程设计

## 第一阶段：开场与自我介绍（1-2轮）
- 用简短友好的方式开场，介绍自己
- 请候选人做自我介绍，了解其基本信息和求职动机
- 注意：自我介绍后，给出简短评价和第一个正式问题

## 第二阶段：能力考察（3-4轮）
根据岗位特点，从以下维度提问：
1. **专业能力**：考察岗位核心技能和知识储备
2. **项目经验**：用STAR法则追问具体案例
3. **问题解决**：考察分析和解决实际问题的能力
4. **学习能力**：了解其成长轨迹和学习方式

## 第三阶段：深度追问（2-3轮）
针对候选人的回答进行深入追问：
- 验证回答的真实性和深度
- 考察其思维逻辑和表达能力
- 了解其在关键时刻的判断和决策

## 第四阶段：情景模拟（1-2轮）
设置与岗位相关的情景问题：
- 考察应变能力和处理复杂情况的能力
- 了解其价值观和职业态度

## 第五阶段：结束总结（1轮）
- 总结面试表现，给出建设性反馈
- 提供职业发展建议
- 礼貌结束面试

---

# 面试行为准则

## 提问原则
1. **一次一问**：每次只问一个核心问题，等待候选人充分回答
2. **由浅入深**：从简单问题开始，逐步深入
3. **具体化**：避免笼统问题，要求举具体例子
4. **STAR法则**：引导候选人完整描述情境(S)、任务(T)、行动(A)、结果(R)

## 回应原则
1. **积极倾听**：对候选人的回答给予简短反馈
2. **适度追问**：当回答模糊或不够深入时，礼貌追问
3. **专业引导**：当候选人不理解问题时，可换种方式引导
4. **保持中立**：不流露过多个人偏好

## 评价维度
在面试过程中，你要默默评价候选人的：
- 回答完整性（是否覆盖问题的各个方面）
- 逻辑清晰度（是否有条理、有层次）
- 具体性（是否有数据、有案例支撑）
- 深度（是否展现思考和洞见）
- 真实性（回答是否可信、前后一致）

---

# 输出格式要求

## 每次回复格式
1. **反馈**：对候选人上一条回答的简短评价（1-2句，不超过50字）
   - 格式：📝 "简短反馈内容"
   
2. **追问或新问题**：根据面试阶段提出下一个问题
   - 格式：🔹 具体问题内容
   - 问题后可附带引导提示（括号内）

3. **结束阶段格式**：
   - 📊 面试评价总结
   - 💡 改进建议
   - 🎯 职业发展建议

## 示例
📝 "感谢你的分享，能感受到你对这个项目很有热情。不过我想了解更多细节。"

🔹 在这个项目中，你遇到的最大挑战是什么？你是如何解决的？（请具体描述当时的情境、你的思考过程和最终方案）

---

# 限制与注意事项
1. 仅讨论岗位相关问题，拒绝回答与面试无关的问题
2. 问题难度要符合候选人经验等级
3. 面试总轮数控制在8-12轮
4. 保持专业、友好的态度，但要有一针见血的追问
5. 不要一次性问多个问题
6. 回复总字数控制在200-400字

---

现在开始面试，请用中文简短开场（不超过60字），介绍自己并邀请候选人做自我介绍。`;

      const messages = [
        { role: "user", content: systemPrompt },
        { role: "assistant", content: "好的，我准备好了。我将扮演一位专业的面试官，按照要求进行面试。" },
        { role: "user", content: "请开始面试。" }
      ];

      const response = await callGLMAPI(messages);

      return NextResponse.json({
        success: true,
        message: response,
        history: [
          { role: "user", content: systemPrompt },
          { role: "assistant", content: "好的，我准备好了。我将扮演一位专业的面试官，按照要求进行面试。" },
          { role: "user", content: "请开始面试。" },
          { role: "assistant", content: response }
        ]
      });
    }

    // 继续对话
    if (action === "chat") {
      if (!history || !Array.isArray(history)) {
        return NextResponse.json({ success: false, error: "缺少对话历史" }, { status: 400 });
      }

      if (!message) {
        return NextResponse.json({ success: false, error: "缺少消息内容" }, { status: 400 });
      }

      // 添加用户消息到历史
      const updatedHistory = [...history, { role: "user", content: message }];

      // 检查是否结束（超过20条消息，约10轮对话）
      const shouldEnd = updatedHistory.length >= 20;

      // 如果要结束，在最后一条用户消息后添加提示
      const messagesToSend = shouldEnd
        ? [
            ...updatedHistory.slice(0, -1),
            { role: "user", content: `${message}\n\n【系统提示】这是最后一轮对话，请按照以下格式给出完整的面试总结：

📊 面试评价
- 整体表现：（综合评价候选人的表现）
- 亮点：（候选人表现突出的方面）
- 待提升：（需要加强的方面）

💡 改进建议
针对候选人的不足，给出具体可行的改进建议

🎯 职业发展建议
根据候选人的背景和岗位方向，给出职业发展建议

最后感谢候选人参加面试。` }
          ]
        : updatedHistory;

      // 调用GLM API
      const response = await callGLMAPI(messagesToSend);

      // 添加回复到历史
      const finalHistory = [...updatedHistory, { role: "assistant", content: response }];

      console.log("Chat completed, message count:", finalHistory.length);

      return NextResponse.json({
        success: true,
        message: response,
        ended: shouldEnd,
        history: finalHistory
      });
    }

    return NextResponse.json({ success: false, error: "无效操作" }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "服务器错误" },
      { status: 500 }
    );
  }
}
