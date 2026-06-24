import React from 'react';
import { BookOpen, MonitorPlay, Database, Activity, Server, FileText } from 'lucide-react';

export function HelpView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Envee CMS 帮助中心</h1>
        <p className="text-slate-500 mt-2">v2026.1 Release Notes & 用户操作指南</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">1. Dashboard 宏观看板</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            Dashboard 作为全局大盘，汇集了所有内容周期的顶层数据。
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-800">数据源</strong>：大盘数据完全实时加载自后端 SQLite 数据库，反映当前周期的实际介质状态。</li>
            <li><strong className="text-slate-800">周期里程碑</strong>：展示当前 2026-Q1-Release 的处理进度，从录入挂载到最终导出发布的流转节点。</li>
            <li><strong className="text-slate-800">图表统计</strong>：自动统计“内容类型分布”及“提供商 Top 排行”，点击右上角刷新可同步最新增量。</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">2. Home (Status Sheet) 内容检索</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            这里是管理内容元数据的核心枢纽。完全还原了松下 MMA 系统的左树右表经典布局。
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-800">分类树联动</strong>：左侧 Category Tree 支持按业务场景（BGM、Movies、Audio PA等）精准过滤，点击节点右侧列表即刻更新。</li>
            <li><strong className="text-slate-800">配置/舱位筛选</strong>：顶部的下拉菜单允许切换不同航线（如 Air India, Eurowings）的特定周期数据。</li>
            <li><strong className="text-slate-800">数据查看</strong>：右侧表格展示了完整的 POS, CHN, UID, Title, Soundtracks 等详细字段，数据真实对应。</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">3. Profile Setup 航线配置向导</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            高度自动化的配置生成器，用于统管复杂的航司配置文件逻辑。
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-800">四级联动</strong>：从 Profile 到 Media Config，再到 Route (航线) 与 Class (舱位)，所有配置项由真实外键在前端自动计算拼接。</li>
            <li><strong className="text-slate-800">所见即所得</strong>：摒弃传统的 JSON 编辑，在 UI 上完成复杂映射关系的设定。</li>
          </ul>
        </section>
        
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">4. 常见问题 (FAQ)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Q: 如何重置数据库中的内容？</h4>
              <p className="text-sm text-slate-600 mt-1">A: 在服务器终端执行 <code>node server/seed.js</code> 即可将数据恢复到出厂松下终端包裹数据。</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Q: 为什么 Ad Builder 模块不见了？</h4>
              <p className="text-sm text-slate-600 mt-1">A: 为了使 CMS 更加聚焦影音娱乐系统 (IFE)，与当前业务无关的广告编排功能已从界面中移除。</p>
            </div>
          </div>
        </section>
      </div>
      
      <div className="mt-12 text-center text-sm text-slate-400">
        &copy; 2026 IFE Content Management System. All rights reserved.
      </div>
    </div>
  );
}
