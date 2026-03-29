"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Factory,
  Landmark,
  ShoppingCart,
  Briefcase,
  User,
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Code,
  Box,
  Settings,
  LineChart,
  Wrench,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  BarChart3,
  PenTool,
  GraduationCap,
  Search,
  Zap,
  ArrowRight,
  Users,
  BookOpen,
  Mic2,
  Globe
} from "lucide-react";

// 行业配置
const industries = [
  {
    id: "tech",
    name: "互联网/科技行业",
    shortName: "互联网/科技",
    icon: Monitor,
    description: "技术驱动型企业，覆盖产品研发、运营推广、市场销售全链路岗位",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    lightGradient: "from-violet-100 to-fuchsia-100",
    iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    stats: "31个热门职位",
    highlight: "技术 · 产品 · 运营 · 设计",
    categories: [
      { id: "tech_dev", name: "技术类", icon: Code, positions: ["后端开发工程师（Java/Go/Python）", "前端开发工程师", "移动端开发（iOS/Android）", "测试开发工程师", "运维工程师", "大数据开发", "算法工程师（推荐/搜索/视觉/NLP）", "嵌入式软件工程师", "架构师", "技术专家"] },
      { id: "tech_product", name: "产品与项目类", icon: Box, positions: ["产品经理（C端/B端/后台/数据）", "产品运营", "项目总监/项目经理", "需求分析师"] },
      { id: "tech_ops", name: "运营类", icon: LineChart, positions: ["用户运营", "内容运营", "新媒体运营", "社群运营", "电商运营", "私域运营", "数据分析师", "增长运营"] },
      { id: "tech_design", name: "设计类", icon: PenTool, positions: ["UI设计师", "UX交互设计师", "视觉设计师", "创意设计专家"] },
      { id: "tech_sales", name: "市场与销售类", icon: TrendingUp, positions: ["市场总监", "品牌经理", "渠道经理", "商务拓展（BD）", "销售经理（KA/区域）", "客户成功经理"] },
      { id: "tech_func", name: "职能类", icon: Settings, positions: ["财务", "法务", "风控", "内控", "行政", "采购", "公关"] }
    ]
  },
  {
    id: "manufacturing",
    name: "制造业/实体工业",
    shortName: "制造业",
    icon: Factory,
    description: "实体经济支柱，涵盖研发生产、质量管理、供应链运营核心岗位",
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    lightGradient: "from-emerald-100 to-cyan-100",
    iconBg: "bg-gradient-to-br from-emerald-500 to-cyan-500",
    stats: "29个热门职位",
    highlight: "研发 · 生产 · 质量 · 供应链",
    categories: [
      { id: "mfg_rnd", name: "研发技术类", icon: Code, positions: ["机械设计工程师", "电气工程师", "自动化工程师", "硬件工程师", "嵌入式开发", "工艺工程师（PE）", "质量工程师（QE/QC）", "测试工程师", "材料工程师", "结构工程师"] },
      { id: "mfg_prod", name: "生产运营类", icon: Wrench, positions: ["生产主管/经理", "生产计划（PMC）", "精益生产工程师", "设备工程师", "厂长/车间主任", "工业工程师（IE）", "供应链经理", "采购工程师", "仓储主管"] },
      { id: "mfg_quality", name: "质量与安全类", icon: ShieldCheck, positions: ["体系工程师（ISO）", "质量经理", "供应商质量工程师（SQE）", "安全工程师（EHS）", "环境健康安全经理"] },
      { id: "mfg_sales", name: "销售与市场类", icon: TrendingUp, positions: ["销售工程师", "区域销售经理", "大客户经理", "外贸经理", "售前技术支持", "市场推广（B2B）"] },
      { id: "mfg_func", name: "职能支持类", icon: Settings, positions: ["财务", "人事", "行政", "IT运维", "关务/报关"] }
    ]
  },
  {
    id: "finance",
    name: "金融行业",
    shortName: "金融",
    icon: Landmark,
    description: "银行证券保险基金，聚焦前台业务、中台风控、后台技术核心人才",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    lightGradient: "from-amber-100 to-yellow-100",
    iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
    stats: "26个热门职位",
    highlight: "前台 · 风控 · 金融科技 · 合规",
    categories: [
      { id: "fin_front", name: "前台业务类", icon: DollarSign, positions: ["客户经理（对公/零售）", "理财经理", "投资顾问", "证券经纪人", "投行项目经理", "研究员（行业/宏观）", "量化研究员", "交易员", "保险代理人/经纪人"] },
      { id: "fin_middle", name: "中台风控与产品类", icon: ShieldCheck, positions: ["风险控制经理（信用/市场/操作风险）", "合规经理", "反洗钱岗", "产品经理（金融产品）", "授信审批", "贷后管理", "精算师（保险）"] },
      { id: "fin_back", name: "后台技术与运营类", icon: Code, positions: ["软件开发工程师（金融科技）", "数据开发", "运维工程师", "系统架构师", "运营操作岗（清算/结算）", "柜员", "客服"] },
      { id: "fin_func", name: "职能类", icon: Settings, positions: ["财务", "审计", "法律合规", "人力资源", "行政", "品牌公关"] }
    ]
  },
  {
    id: "retail",
    name: "消费品/零售/连锁",
    shortName: "消费品零售",
    icon: ShoppingCart,
    description: "快消零售连锁品牌，覆盖门店运营、电商渠道、供应链全业态岗位",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    lightGradient: "from-rose-100 to-red-100",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-500",
    stats: "21个热门职位",
    highlight: "品牌 · 电商 · 门店 · 供应链",
    categories: [
      { id: "retail_hq", name: "总部职能类", icon: BarChart3, positions: ["品牌经理", "市场推广", "产品经理（快消品）", "电商运营（天猫/京东/抖音）", "内容运营", "直播运营", "私域运营", "数据分析", "财务", "法务", "IT"] },
      { id: "retail_sales", name: "销售与零售运营类", icon: TrendingUp, positions: ["区域经理", "城市经理", "门店店长/店经理", "零售督导", "渠道经理", "KA经理（重点客户）", "销售代表", "导购/店员"] },
      { id: "retail_supply", name: "供应链与商品类", icon: Box, positions: ["采购经理（品类/生鲜/非食）", "供应链计划", "物流经理", "仓储主管", "商品陈列师"] },
      { id: "retail_support", name: "支持类", icon: Users, positions: ["培训专员/培训师（门店培训）", "视觉陈列", "客服经理"] }
    ]
  },
  {
    id: "consulting",
    name: "咨询/专业服务",
    shortName: "咨询专业服务",
    icon: Briefcase,
    description: "四大、律所、管理咨询、猎头，聚焦专业服务与知识型岗位",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    lightGradient: "from-sky-100 to-indigo-100",
    iconBg: "bg-gradient-to-br from-sky-500 to-indigo-500",
    stats: "16个热门职位",
    highlight: "咨询 · 审计 · 法律 · 研究",
    categories: [
      { id: "cons_pro", name: "专业服务类", icon: GraduationCap, positions: ["咨询顾问（战略/管理/IT/人力/财务等）", "高级顾问/经理", "分析师", "审计员/审计经理", "税务专员/经理", "律师/律师助理", "法务顾问"] },
      { id: "cons_bd", name: "业务拓展类", icon: TrendingUp, positions: ["客户经理", "商务拓展（BD）", "大客户总监", "投标专员"] },
      { id: "cons_research", name: "研究与支持类", icon: Search, positions: ["行业研究员", "数据分析师", "知识管理专员", "市场调研员"] },
      { id: "cons_func", name: "内部职能类", icon: Settings, positions: ["财务", "IT支持", "人力资源（内部HR）", "行政", "市场部（内容/活动）"] }
    ]
  },
  {
    id: "education",
    name: "教育/培训行业",
    shortName: "教育培训",
    icon: BookOpen,
    description: "K12、高等教育、职业培训、在线教育，涵盖教学教研、课程研发、教务管理核心岗位",
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    lightGradient: "from-teal-100 to-sky-100",
    iconBg: "bg-gradient-to-br from-teal-500 to-sky-500",
    stats: "28个热门职位",
    highlight: "教学 · 教研 · 课程 · 运营",
    categories: [
      { id: "edu_teaching", name: "教学类", icon: GraduationCap, positions: ["学科教师（语数英理化生政史地）", "幼教老师/幼儿园教师", "小学/初中/高中教师", "国际学校教师（IB/AP/A-Level）", "特教老师（特殊教育）", "艺术类教师（音乐/美术/舞蹈）", "体育教师", "心理咨询师/心理老师"] },
      { id: "edu_research", name: "教研与课程类", icon: BookOpen, positions: ["教研员/教学研究员", "课程设计师", "教材编辑", "教学产品经理", "STEAM教育研发", "在线课程策划", "题库研发专员", "教育内容主编"] },
      { id: "edu_training", name: "培训与企业大学类", icon: Mic2, positions: ["企业培训师", "培训经理/总监", "企业大学运营", "学习发展专员（L&D）", "培训课程开发", "内训师", "培训运营专员", "领导力培训顾问"] },
      { id: "edu_online", name: "在线教育与运营类", icon: Globe, positions: ["在线教育运营", "直播课运营/助教", "社群运营（教育）", "用户增长（教育产品）", "私域运营（教育）", "学习顾问/班主任", "课程顾问/销售", "教育产品运营"] },
      { id: "edu_admin", name: "教务与管理类", icon: Users, positions: ["教务主管/经理", "校区校长/园长", "招生主管/经理", "学生事务主管", "学术总监/教学总监", "年级组长/学科组长", "升学指导老师", "留学顾问"] },
      { id: "edu_func", name: "职能支持类", icon: Settings, positions: ["教育行业HR", "教育行业财务", "市场营销（教育）", "品牌推广（教育机构）", "IT运维（教育科技）", "行政后勤"] }
    ]
  }
];

// 经验等级配置
const experienceLevels = [
  { id: "beginner", name: "应届生/实习", description: "即将毕业或刚入行，关注基础能力与学习潜力", icon: "🎓" },
  { id: "junior", name: "1-3年经验", description: "有一定工作经验，关注技能深化与项目经验", icon: "🚀" },
  { id: "mid", name: "3-5年经验", description: "资深从业者，关注专业深度与独立解决问题能力", icon: "💪" },
  { id: "senior", name: "5-10年经验", description: "专家级别，关注战略思维与团队管理能力", icon: "⭐" },
  { id: "expert", name: "10年以上经验", description: "高管级别，关注领导力与行业洞察", icon: "👑" }
];

// 消息类型
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// API历史消息类型
interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// 面试阶段
type InterviewStage = "industry" | "category" | "position" | "experience" | "interview" | "ended";

export default function MockInterviewPage() {
  // 面试状态
  const [stage, setStage] = useState<InterviewStage>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryMessage[]>([]);
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 选择行业
  const selectIndustry = (industryId: string) => {
    setSelectedIndustry(industryId);
    setSelectedCategory(null);
    setSelectedPosition(null);
    setStage("category");
  };

  // 选择职位类别
  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedPosition(null);
    setStage("position");
  };

  // 选择具体职位
  const selectPosition = (position: string) => {
    setSelectedPosition(position);
    setStage("experience");
  };

  // 开始面试
  const startInterview = async () => {
    if (!selectedIndustry || !selectedPosition || !selectedExperience) return;
    setStage("interview");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          industry: selectedIndustry,
          position: selectedPosition,
          userExperience: selectedExperience
        })
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(data.history);
        setMessages([{ id: Date.now().toString(), role: "assistant", content: data.message, timestamp: new Date() }]);
      } else {
        setMessages([{ id: Date.now().toString(), role: "assistant", content: `面试开始遇到问题：${data.error}`, timestamp: new Date() }]);
      }
    } catch {
      setMessages([{ id: Date.now().toString(), role: "assistant", content: "网络连接出现问题，请检查网络后重试。", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          message: userMessage.content, 
          history: chatHistory 
        })
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(data.history);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.message, timestamp: new Date() }]);
        if (data.ended) setStage("ended");
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `发生错误：${data.error}`, timestamp: new Date() }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "网络连接出现问题，请重试。", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 重新开始
  const restartInterview = () => {
    setStage("industry");
    setSelectedIndustry(null);
    setSelectedCategory(null);
    setSelectedPosition(null);
    setSelectedExperience(null);
    setMessages([]);
    setInputValue("");
    setChatHistory([]);
  };

  // 获取信息
  const getIndustryInfo = () => industries.find(i => i.id === selectedIndustry);
  const getCategoryInfo = () => getIndustryInfo()?.categories.find(c => c.id === selectedCategory);
  const getExperienceInfo = () => experienceLevels.find(e => e.id === selectedExperience);

  // ========== 渲染行业选择界面 ==========
  if (stage === "industry") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* 背景装饰 - 更精致的渐变 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 to-fuchsia-100/30 dark:from-violet-900/20 dark:to-fuchsia-900/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-200/40 to-teal-100/30 dark:from-cyan-900/20 dark:to-teal-900/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-amber-100/30 to-orange-50/20 dark:from-amber-900/10 dark:to-orange-900/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          {/* 标题区域 - 更紧凑 */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-200/50 dark:border-violet-700/30 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI模拟面试助手</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">选择你的目标行业</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              选择行业，系统将为你匹配对应的<span className="font-medium text-foreground">资深HR面试官</span>
            </p>
          </div>

          {/* 行业卡片 - 优化响应式网格布局 */}
          {/* 手机(640px以下): 单列 | 平板(640-1024px): 2列 | PC(1024px以上): 3列 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 xl:gap-6">
            {industries.map((industry) => {
              const Icon = industry.icon;
              const isHovered = hoveredIndustry === industry.id;

              return (
                <div 
                  key={industry.id} 
                  className="group relative cursor-pointer" 
                  onMouseEnter={() => setHoveredIndustry(industry.id)} 
                  onMouseLeave={() => setHoveredIndustry(null)} 
                  onClick={() => selectIndustry(industry.id)}
                >
                  {/* 发光效果 */}
                  <div className={`absolute -inset-1 rounded-2xl transition-all duration-500 bg-gradient-to-r ${industry.gradient} opacity-0 blur-lg ${isHovered ? "opacity-40" : ""}`} />

                  {/* 卡片主体 - 固定高度，内容居中分布 */}
                  <div className={`relative h-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${isHovered ? "border-transparent shadow-2xl scale-[1.02]" : "border-slate-200/80 dark:border-slate-700/50 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600"}`}>
                    {/* 顶部渐变条 */}
                    <div className={`h-1.5 bg-gradient-to-r ${industry.gradient}`} />

                    {/* 卡片内容 */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col">
                      {/* 上部：图标和标题 */}
                      <div className="flex items-start gap-3 sm:gap-4 mb-3">
                        {/* 图标 */}
                        <div className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${industry.iconBg} shadow-lg ${isHovered ? "scale-105 shadow-xl" : ""}`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        {/* 标题和统计 */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base sm:text-lg font-bold mb-0.5 transition-colors duration-300 truncate ${isHovered ? "bg-gradient-to-r " + industry.gradient + " bg-clip-text text-transparent" : "text-slate-900 dark:text-white"}`}>
                            {industry.shortName}
                          </h3>
                          <p className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent`}>
                            {industry.stats}
                          </p>
                        </div>
                      </div>

                      {/* 中部：描述 */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-grow">
                        {industry.description}
                      </p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {industry.highlight.split("·").map((tag, i) => (
                          <span key={i} className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${industry.lightGradient} text-slate-600 dark:text-slate-300 whitespace-nowrap`}>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>

                      {/* 底部按钮 */}
                      <div className={`mt-auto flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r ${industry.gradient} text-white text-xs sm:text-sm font-medium transition-all duration-300 shadow-md ${isHovered ? "shadow-lg opacity-100" : "opacity-90"}`}>
                        开始选择
                        <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-muted-foreground">
              💡 选择行业后，将进一步选择具体职位类别和岗位
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染职位类别选择界面 ==========
  if (stage === "category") {
    const industry = getIndustryInfo();
    if (!industry) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br ${industry.gradient} opacity-10 rounded-full blur-3xl`} />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* 标题区域 */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-200/50 dark:border-violet-700/30 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI模拟面试助手</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">选择职位类别</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>当前行业：</span>
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0 text-xs`}>
                {industry.name}
              </Badge>
            </div>
          </div>

          {/* 类别卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {industry.categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <div 
                  key={category.id} 
                  className={`relative cursor-pointer rounded-xl border transition-all duration-200 ${isSelected ? "border-2 shadow-lg scale-[1.02]" : "border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"}`}
                  onClick={() => selectCategory(category.id)}
                >
                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${industry.gradient} flex items-center justify-center shadow-md`}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-5 bg-white/90 dark:bg-slate-900/80 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 sm:p-2.5 rounded-lg ${industry.iconBg} shadow-md`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base">{category.name}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                      {category.positions.slice(0, 3).join("、")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{category.positions.length}个职位</span>
                      <ArrowRight className={`w-4 h-4 transition-all ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setStage("industry")} className="text-sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回选择行业
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染具体职位选择界面 ==========
  if (stage === "position") {
    const industry = getIndustryInfo();
    const category = getCategoryInfo();
    if (!industry || !category) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br ${industry.gradient} opacity-10 rounded-full blur-3xl`} />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* 标题区域 */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-200/50 dark:border-violet-700/30 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI模拟面试助手</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">选择具体职位</h1>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground flex-wrap">
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0 text-xs`}>
                {industry.shortName}
              </Badge>
              <span>·</span>
              <span className="font-medium text-primary">{category.name}</span>
            </div>
          </div>

          {/* 职位列表 - 紧凑布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-6">
            {category.positions.map((position) => {
              const isSelected = selectedPosition === position;

              return (
                <div 
                  key={position} 
                  className={`cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 ${isSelected ? `border-2 bg-gradient-to-r ${industry.lightGradient} shadow-md` : "border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"}`}
                  onClick={() => selectPosition(position)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{position}</span>
                    {isSelected && (
                      <div className={`ml-2 w-2 h-2 rounded-full bg-gradient-to-r ${industry.gradient} flex-shrink-0`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" onClick={() => setStage("category")} className="text-sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回选择类别
            </Button>
            <Button disabled={!selectedPosition} onClick={() => setStage("experience")} className={`text-sm ${selectedPosition ? `bg-gradient-to-r ${industry.gradient} hover:opacity-90` : ""}`}>
              下一步
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染经验等级选择界面 ==========
  if (stage === "experience") {
    const industry = getIndustryInfo();
    const category = getCategoryInfo();
    if (!industry || !category || !selectedPosition) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br ${industry.gradient} opacity-10 rounded-full blur-3xl`} />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* 标题区域 */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-200/50 dark:border-violet-700/30 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI模拟面试助手</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">选择你的经验等级</h1>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground flex-wrap">
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0 text-xs`}>{industry.shortName}</Badge>
              <span>·</span>
              <span>{category.name}</span>
              <span>·</span>
              <span className="font-medium text-primary truncate max-w-[150px] sm:max-w-none">{selectedPosition}</span>
            </div>
          </div>

          {/* 经验等级卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {experienceLevels.map((level) => {
              const isSelected = selectedExperience === level.id;

              return (
                <div 
                  key={level.id} 
                  className={`cursor-pointer rounded-xl border transition-all duration-200 ${isSelected ? "border-2 shadow-lg scale-[1.02]" : "border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"}`}
                  onClick={() => setSelectedExperience(level.id)}
                >
                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${industry.gradient} flex items-center justify-center shadow-md`}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div className="p-3 sm:p-4 text-center bg-white/90 dark:bg-slate-900/80 rounded-xl relative">
                    <div className="text-2xl sm:text-3xl mb-2">{level.icon}</div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-1">{level.name}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">{level.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部按钮 */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" onClick={() => setStage("position")} className="text-sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回选择职位
            </Button>
            <Button disabled={!selectedExperience} onClick={startInterview} className={`text-sm ${selectedExperience ? `bg-gradient-to-r ${industry.gradient} hover:opacity-90` : ""}`}>
              <Zap className="w-4 h-4 mr-1" />
              开始模拟面试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染面试界面 ==========
  const industry = getIndustryInfo();
  const experience = getExperienceInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header - 简洁顶部栏 */}
      <div className="border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="w-full max-w-3xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={`p-2 sm:p-2.5 rounded-lg ${industry?.iconBg} shadow-md`}>
                {industry && <industry.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm sm:text-base truncate">{selectedPosition}</h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">{experience?.name}</Badge>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{industry?.shortName}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={restartInterview} className="text-xs sm:text-sm h-8 px-2 sm:px-3">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">重新开始</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]" ref={scrollRef}>
          <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                    <AvatarFallback className={`${message.role === "user" ? `bg-gradient-to-r ${industry?.gradient || "from-violet-500 to-fuchsia-500"} text-white` : "bg-slate-100 dark:bg-slate-800"}`}>
                      {message.role === "user" ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${message.role === "user" ? `bg-gradient-to-r ${industry?.gradient || "from-violet-500 to-fuchsia-500"} text-white` : "bg-white dark:bg-slate-800 border shadow-sm"}`}>
                    <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${message.role === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                      {message.timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 sm:gap-3">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-slate-800 border shadow-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-violet-500" />
                      <span className="text-xs sm:text-sm text-muted-foreground">正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 */}
      <div className="border-t bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-3xl mx-auto px-4 py-3 sm:py-4">
          {stage === "ended" ? (
            <div className="text-center py-3 sm:py-4">
              <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">🎉 面试已结束，祝你求职顺利！</p>
              <Button onClick={restartInterview} className={`bg-gradient-to-r ${industry?.gradient} hover:opacity-90`}>
                <RotateCcw className="w-4 h-4 mr-2" />
                开始新一轮面试
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入你的回答..."
                className="min-h-[40px] sm:min-h-[44px] max-h-24 sm:max-h-32 resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} className={`h-10 sm:h-11 px-3 sm:px-4 ${industry ? `bg-gradient-to-r ${industry.gradient} hover:opacity-90` : ""}`}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Build timestamp: 1774775000
// force rebuild for Netlify cache refresh
