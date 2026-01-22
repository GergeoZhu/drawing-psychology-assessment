// Data Types
export interface DimensionScore {
  subject: string; score: number; avgScore: number; description: string;
}

export interface AttachmentStyle {
  type: string; // e.g., "安全型", "焦虑型"
  percentage: number; // 倾向程度
  description: string;
  characteristics: string[];
}

export interface VisualAnalysis {
  layout: string; // 布局解读
  lineQuality: string; // 线条质量
  houseDetails: string; // 房子细节解读
  treeDetails: string; // 树木细节解读
  personDetails: string; // 人物细节解读
}

export interface HealthAdvice {
  category: string; // e.g. "情绪调节", "人际边界", "自我关怀"
  title: string;
  content: string;
}

export interface AnalysisResult {
  id: string; 
  date: string;
  
  // 1. 画面解读 (Visual Interpretation)
  visualAnalysis: VisualAnalysis;

  // 2. 大五人格 (Big Five)
  dimensions: DimensionScore[];

  // 3. MBTI
  mbti?: { type: string; title: string; description: string; traits: string[] };

  // 4. 依恋风格 (Attachment Style)
  attachment: AttachmentStyle;

  // 5. 综述 (Synthesis)
  synthesis: { 
    title: string;
    summary: string;
    psychologicalState: string;
    // guidance moved to specific section
  };

  // 6. 心理健康建议 (New Section)
  healthAdvice: HealthAdvice[];
}

// --- Deep Analysis Generator ---

const VISUAL_DESCRIPTIONS = {
  layouts: [
    "画面构图整体呈现居中偏稳的态势，核心元素占据了纸张的视觉中心，这通常暗示作画者具备较强的自我中心意识与现实掌控欲。空间留白处理得当，显示出思维的条理性。",
    "整体布局略显松散，元素之间保持着微妙的距离感。画面重心有向左偏移的倾向，在心理动力学上，这往往投射出对过去经历的某种留恋，或是潜意识中寻求母性安全感的心理诉求。",
    "构图饱满，甚至有溢出纸张边缘的趋势。这种充满张力的空间利用方式，折射出作画者充沛的心理能量与向外扩张的行动力，但也可能暗示着对环境界限的某种无意识挑战。",
    "画面元素在空间分布上呈现出一种独特的'悬浮感'，基线处理较为模糊。这种布局往往出现在那些思维跳跃、想象力丰富，但可能在现实落地能力上感到一丝焦虑的个体画作中。"
  ],
  lines: [
    "笔触线条流畅而富有弹性，运笔压力均匀，没有明显的断裂或反复涂抹痕迹。这种高质量的线条特征是情绪稳定性良好的有力证据，显示出作画者在面对压力时具备优秀的自我调节能力。",
    "线条呈现出一种刻意的刚直感，转折处棱角分明。这种'硬朗'的笔触风格，通常是理智化防御机制的体现，暗示作画者习惯用逻辑和规则来构建内心的安全壁垒，不愿轻易流露柔软的情感。",
    "画面中存在多处断续的线条与反复修饰的痕迹，特别是在轮廓线的勾勒上显得犹豫不决。这在投射测验中常被解读为焦虑水平的某种外化，反映出作画者在自我确认过程中的谨慎与不安。",
    "运笔轻盈，线条如同游丝般纤细，部分区域甚至若隐若现。这种'低能量'的线条特质，往往对应着极高的敏感度与内省倾向，作画者可能是一个内心细腻但容易受环境影响的人。"
  ],
  houses: [
    "房子的描绘强调了结构的封闭性与完整性。门窗比例相对保守，且似乎有某种形式的遮挡（如窗帘或阴影）。这种描绘方式投射出作画者在家庭观念上的传统与对私密空间的极度重视，内心渴望一个绝对安全的避风港。",
    "画面中的房屋呈现出开放、欢迎的姿态，门窗开阔且路径清晰。这种特征通常与健康的家庭依恋关系相关，暗示作画者在亲密关系中愿意主动敞开心扉，具备良好的情感涵容能力。",
    "房子的屋顶被刻意强调或描绘得格外巨大，在象征层面，屋顶代表着幻想与思维活动。这种构图暗示作画者可能习惯沉浸在精神世界中，有时甚至会将思考作为逃避现实琐碎的一种方式。",
    "房屋的立体感较弱，呈现出平面化的特征，且缺乏过多的修饰细节。这种'极简主义'的房屋投射，可能反映出作画者对物质生活的淡泊，或是当前对家庭生活的一种情感抽离状态。"
  ],
  trees: [
    "树木的树冠部分描绘得格外繁茂，呈云朵状发散，占据了较大的画面比例。树冠象征着个体与环境的互动界面，这显示出作画者拥有丰富的人际交往意愿和极强的环境适应潜力。",
    "树干粗壮有力，且在根部有明显的抓地描绘（或地平线强化）。这象征着作画者对'存在感'与'安全感'的强烈渴求，在潜意识中，他们正在努力扎根于现实，寻求稳固的立足点。",
    "树枝尖锐，呈放射状伸向四周，或呈现出枯枝的形态。这种具有侵入性的线条特征，往往是内在攻击性冲动或防御心理的投射，暗示作画者可能正处于某种情绪的应激状态。",
    "树木整体形态修长，树干细弱但挺拔。这种形态常见于理想主义者的画作中，象征着虽然现实支撑力略显单薄，但精神追求却从未停止，带有一种孤傲的成长姿态。"
  ],
  persons: [
    "人物形象的头部比例适中，五官描绘清晰，尤其是眼睛部分被赋予了神采。这表明作画者拥有健康的自我概念，对外界保持着适度的好奇心与观察力，具备良好的现实检验能力。",
    "人物的肢体动作略显僵硬，手臂紧贴躯干或被隐藏。在肢体语言投射中，这通常被解读为被动与退缩的信号，暗示作画者在社会适应中可能存在一定的社交焦虑或自我保护倾向。",
    "画中人物张开双臂，呈现出一种拥抱或平衡的姿态。这种开放的身体图式，是作画者渴望与他人建立深度连接的直接流露，同时也显示出其在人际关系中愿意付出与接纳的态度。",
    "人物仅有轮廓而缺乏细节，或呈现出某种符号化（如火柴人）的特征。这可能是一种防御性的退行表现，暗示作画者试图隐藏真实的自我，或在面对'自我审视'这一课题时感到回避。"
  ]
};

const ATTACHMENT_STYLES: AttachmentStyle[] = [
  { 
    type: "安全型依恋 (Secure)", 
    percentage: 75,
    description: "你对自己和他人都有积极的看法。在亲密关系中，你既能享受亲密，又能保持独立。你相信自己值得被爱，也相信他人是值得信赖的。",
    characteristics: ["适度的依赖与独立", "情绪表达顺畅", "信任他人", "抗压能力强"]
  },
  { 
    type: "疏离-回避型依恋 (Dismissing-Avoidant)", 
    percentage: 65,
    description: "你倾向于通过强调独立和自给自足来保护自己。你可能会压抑对亲密的渴望，在情感上与他人保持距离，以避免受伤害。",
    characteristics: ["过度强调独立", "压抑情感需求", "难以信任", "回避深度亲密"]
  },
  { 
    type: "焦虑-矛盾型依恋 (Anxious-Preoccupied)", 
    percentage: 70,
    description: "你非常渴望亲密关系，但往往对关系感到不安全。你可能过度依赖他人的认可来获得自我价值感，容易担心被抛弃。",
    characteristics: ["渴望高浓度亲密", "情绪波动大", "过度敏感", "寻求不断确认"]
  },
  { 
    type: "恐惧-回避型依恋 (Fearful-Avoidant)", 
    percentage: 60,
    description: "你在渴望亲密的同时又恐惧亲密。这种矛盾心态可能源于过去未处理的创伤，让你在想要靠近和想要逃离之间反复挣扎。",
    characteristics: ["矛盾的社交态度", "自我价值感低", "对拒绝敏感", "行为不可预测"]
  }
];

// Helper
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function analyzeImage(imageData: string): Promise<AnalysisResult> {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 2000));

  // Generate scores
  // extraversion, emotional_stability, openness, agreeableness, conscientiousness
  const dimScores = [
    { subject: '外向性', score: 40 + Math.random() * 50 },
    { subject: '情绪稳定', score: 50 + Math.random() * 40 },
    { subject: '开放性', score: 45 + Math.random() * 50 },
    { subject: '亲和力', score: 40 + Math.random() * 50 },
    { subject: '责任心', score: 50 + Math.random() * 40 }
  ];

  const dimensions: DimensionScore[] = dimScores.map(d => ({
    subject: d.subject,
    score: Math.floor(d.score),
    avgScore: 50 + Math.floor(Math.random() * 10), 
    description: "常模标准分对比"
  }));

  const mbtiTypes = [
    { type: "INFJ", title: "提倡者", description: "安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。", traits: ["富有创意", "洞察力强", "有原则", "热情"] },
    { type: "INTJ", title: "建筑师", description: "富有想象力和战略性的思想家，一切皆在计划之中。", traits: ["理性", "独立", "坚定", "好奇"] },
    { type: "ENFP", title: "竞选者", description: "热情，有创造力，爱社交的自由精神。", traits: ["充满好奇", "观察力敏锐", "精力充沛", "善于沟通"] },
    { type: "INFP", title: "调停者", description: "诗意，善良的利他主义者，总是热情地为正义事业服务。", traits: ["理想主义", "寻求和谐", "开放", "灵活"] },
    { type: "ENTP", title: "辩论家", description: "聪明好奇的思想者，这种人无法抗拒智力挑战。", traits: ["知识丰富", "思维敏捷", "独创性", "魅力"] }
  ];

  const selectedMBTI = pickRandom(mbtiTypes);
  const visual = {
    layout: pickRandom(VISUAL_DESCRIPTIONS.layouts),
    lineQuality: pickRandom(VISUAL_DESCRIPTIONS.lines),
    houseDetails: pickRandom(VISUAL_DESCRIPTIONS.houses),
    treeDetails: pickRandom(VISUAL_DESCRIPTIONS.trees),
    personDetails: pickRandom(VISUAL_DESCRIPTIONS.persons),
  };

  const attachment = pickRandom(ATTACHMENT_STYLES);

  // Generate Personalized Health Advice based on dimensions & attachment
  const advice: HealthAdvice[] = [];

  // 1. Based on Emotional Stability (Low Score -> Stress Advice)
  const emoScore = dimensions.find(d => d.subject === '情绪稳定')?.score || 50;
  if (emoScore < 60) {
    advice.push({
      category: "情绪调节",
      title: "建立情绪缓冲区",
      content: "你的情绪感受力很强，但有时容易受环境影响。建议练习'正念呼吸'或'情绪着陆技术'（5-4-3-2-1法），帮助自己在压力情境下快速找回内心的锚点。"
    });
  } else {
    advice.push({
      category: "情绪调节",
      title: "保持情绪流动",
      content: "你具备良好的情绪稳定性。为了进一步提升，建议尝试更深层的情感表达，如写情绪日记，让积极能量不仅停留在认知层面，更流动到生活细节中。"
    });
  }

  // 2. Based on Attachment Style
  if (attachment.type.includes("焦虑")) {
    advice.push({
      category: "自我关怀",
      title: "肯定自我价值",
      content: "在亲密关系中，你可能容易过度寻求对方的确认。请试着练习'自我安抚'，每天记录三件自己做得好的小事，逐步建立不依赖外界评价的内在安全感。"
    });
  } else if (attachment.type.includes("回避")) {
    advice.push({
      category: "人际连接",
      title: "练习适度依赖",
      content: "独立是你的铠甲，但也可能成为隔绝温暖的墙。尝试在安全的关系中，从小事开始（如分享一个小烦恼），练习向他人展示一点点脆弱，你会发现连接并不意味着失去自我。"
    });
  } else {
    advice.push({
      category: "人际连接",
      title: "深化关系质量",
      content: "你拥有安全型的依恋模式，这是宝贵的心理资源。可以尝试成为身边人的'安全基地'，在深度倾听与支持中，进一步丰富自己的人生体验。"
    });
  }

  // 3. Based on Conscientiousness/Perfectionism (High -> Relax)
  const consScore = dimensions.find(d => d.subject === '责任心')?.score || 50;
  if (consScore > 75) {
    advice.push({
      category: "生活平衡",
      title: "练习'足够好'",
      content: "你的高标准让你成就斐然，但也可能带来紧绷感。试着在非核心领域允许自己做到'60分'，给自己留出无目的的'发呆时间'，创造力往往在松弛中诞生。"
    });
  } else {
    advice.push({
      category: "生活平衡",
      title: "建立微习惯",
      content: "为了更好地实现自我目标，可以尝试'微习惯'策略：将大目标拆解为每天2分钟就能完成的小行动，在低阻力中建立秩序感。"
    });
  }

  // Synthesis Summary construction
  const synthesisSummary = `通过对画面整体格式塔（Gestalt）的分析，我们可以看到一个心理结构${dimensions[1].score > 60 ? '相对稳固' : '正在重组中'}的个体。${visual.layout.substring(0, 20)}...这一特征与${selectedMBTI.type}人格类型中的${selectedMBTI.traits[0]}特质形成了某种内在的呼应。画作中的能量流动显示，你当前正处于一个自我整合的关键期，虽然${attachment.type.split(' ')[0]}的依恋模式可能会在人际间隙带来些许挑战，但内在的成长动力依然强劲。`;

  return {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toISOString(),
    
    visualAnalysis: visual,
    dimensions,
    mbti: selectedMBTI,
    attachment,
    
    synthesis: {
      title: "全维心理画像综述",
      summary: synthesisSummary,
      psychologicalState: `当前心理能量处于${dimensions[1].score > 70 ? '充盈' : '平稳'}状态。画面的投射特征显示，你具备${dimensions[2].score > 60 ? '良好的心理弹性' : '细腻的感知力'}，能够敏锐地捕捉环境信息。`,
    },

    healthAdvice: advice
  };
}
