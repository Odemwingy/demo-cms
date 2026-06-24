import React, { useState, useEffect, useMemo } from "react";
import {
  Clock, TrendingUp, Activity, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Layers, RefreshCw, ExternalLink,
  CheckCircle2, AlertCircle, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { useNavigate } from "react-router";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

export function DashboardView() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        setMedia(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const total = media.length;
    // Since we don't have accurate createdAt fields in the terminal data, we simulate a week's difference for UI purposes
    const addedThisWeek = Math.floor(total * 0.15) || 0; 
    
    let pending = 0;
    let anomalies = 0;
    
    const typesMap: Record<string, number> = { "视频": 0, "音频": 0, "游戏": 0, "其他": 0 };
    const provMap: Record<string, number> = {};

    media.forEach(m => {
      if (m.sign_off_status !== 'Full Sign-Off') pending++;
      if (!m.rating || !m.duration) anomalies++;

      let t = '其他';
      if (m.video_type) t = '视频';
      else if (m.audio_type) t = '音频';
      else if (m.distributor === 'Games') t = '游戏';
      typesMap[t]++;

      const p = m.distributor || 'Unknown';
      provMap[p] = (provMap[p] || 0) + 1;
    });

    const typeData = Object.keys(typesMap).filter(k => typesMap[k] > 0).map(k => ({ name: k, value: typesMap[k] }));
    const provData = Object.keys(provMap).map(k => ({ name: k, 内容数: provMap[k] })).sort((a,b) => b.内容数 - a.内容数).slice(0, 8);

    // Mock trend for visual completeness as requested by the original dashboard
    const weeklyTrend = [
      { name: "03/24", day: "03/24", 新增: 8, 上架: 12, 下架: 3 },
      { name: "03/25", day: "03/25", 新增: 15, 上架: 9, 下架: 5 },
      { name: "03/26", day: "03/26", 新增: 12, 上架: 18, 下架: 2 },
      { name: "03/27", day: "03/27", 新增: 6, 上架: 14, 下架: 8 },
      { name: "03/28", day: "03/28", 新增: 22, 上架: 20, 下架: 4 },
      { name: "03/29", day: "03/29", 新增: 18, 上架: 16, 下架: 6 },
      { name: "03/30", day: "03/30", 新增: Math.floor(addedThisWeek/2), 上架: addedThisWeek, 下架: 3 },
    ];

    const signoffProgress = [
      { name: "W1", 已签核: 45, 待签核: 30, 已驳回: 5 },
      { name: "W2", 已签核: 60, 待签核: 20, 已驳回: 2 },
      { name: "W3", 已签核: 85, 待签核: 15, 已驳回: 1 },
      { name: "W4", 分配: 110, 已签核: 110, 待签核: 5, 已驳回: 0 },
    ];

    const qualityData = [
      { name: "完整", value: total - anomalies, color: "#10b981" },
      { name: "异常", value: anomalies, color: "#ef4444" },
    ];

    return { total, addedThisWeek, pending, anomalies, typeData, provData, weeklyTrend, signoffProgress, qualityData };
  }, [media]);

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold">欢迎回来, Admin</h1>
            <p className="text-sm text-gray-500 mt-1">
              周期: 2026-Q1-Release · 实时数据库同步
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} disabled={loading} className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 刷新数据
            </button>
            <button onClick={() => navigate('/home')} className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm font-medium">
              <ExternalLink className="w-4 h-4" /> 进入内容中心
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">内容总数</p>
                <p className="text-2xl text-gray-900 font-bold">{stats.total}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>实时统计</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">近期上架</p>
                <p className="text-2xl text-gray-900 font-bold">{stats.addedThisWeek}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>估算</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">待处理任务</p>
                <p className="text-2xl text-gray-900 font-bold">{stats.pending}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>待签核状态</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">质量异常</p>
                <p className="text-2xl text-gray-900 font-bold">{stats.anomalies}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>信息缺失</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-gray-900 flex items-center gap-2 font-bold">
              <Activity className="w-5 h-5 text-indigo-500" />
              周期里程碑 (2026-Q1-Release)
            </h3>
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded border border-amber-200 font-medium">
              进行中
            </span>
          </div>
          <div className="flex items-center w-full mt-8 mb-4 px-4">
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-emerald-500 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs mt-2 whitespace-nowrap text-gray-700 font-semibold">录入与挂载</p>
            </div>
            <div className="flex-1 h-0.5 mx-2 -mt-6 bg-emerald-500"></div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-emerald-500 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs mt-2 whitespace-nowrap text-gray-700 font-semibold">状态检查</p>
            </div>
            <div className="flex-1 h-0.5 mx-2 -mt-6 bg-indigo-500"></div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-100">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              </div>
              <p className="text-xs mt-2 whitespace-nowrap text-indigo-700 font-semibold">签核审批</p>
            </div>
            <div className="flex-1 h-0.5 mx-2 -mt-6 bg-gray-200"></div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-gray-200 text-gray-300">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
              </div>
              <p className="text-xs mt-2 whitespace-nowrap text-gray-400 font-semibold">完整性校验</p>
            </div>
            <div className="flex-1 h-0.5 mx-2 -mt-6 bg-gray-200"></div>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-gray-200 text-gray-300">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
              </div>
              <p className="text-xs mt-2 whitespace-nowrap text-gray-400 font-semibold">导出与发布</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-900 flex items-center gap-2 font-bold">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> 本周内容动态趋势 (演示)
              </h3>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                  />
                  <Area type="monotone" dataKey="上架" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="新增" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="下架" stackId="3" stroke="#f87171" fill="#f87171" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm text-gray-900 flex items-center gap-2 mb-2 font-bold">
              <PieChartIcon className="w-4 h-4 text-indigo-500" /> 内容类型分布
            </h3>
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs mt-1">
              {stats.typeData.map((item, i) => (
                <span key={item.name} className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                  {item.name} ({item.value})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Provider Bar Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm text-gray-900 flex items-center gap-2 mb-4 font-bold">
              <BarChart3 className="w-4 h-4 text-indigo-500" /> 提供商内容分布 (Top 8)
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.provData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="内容数" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quality Overview */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm text-gray-900 flex items-center gap-2 mb-4 font-bold">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> 质量概览
            </h3>
            <div className="flex h-[180px] items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.qualityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.qualityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-4 pl-4">
                {stats.qualityData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-900 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
