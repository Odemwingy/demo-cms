import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';
import { Folder, FolderOpen, ChevronRight, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { cn } from './ui/Button';
import { TREE_DATA } from '../pages/CategoryTree';

function TreeNode({ 
  node, depth = 0, expandedIds, toggleExpand, checkedIds, toggleCheck, onSelectCategory, activeCategoryId
}: { 
  node: any, depth?: number, expandedIds: Set<string>, toggleExpand: (id: string) => void, 
  checkedIds: Set<string>, toggleCheck: (id: string) => void, onSelectCategory: (cat: string) => void,
  activeCategoryId?: string
}) {
  const isLeaf = !node.children || node.children.length === 0;
  const isExpanded = expandedIds.has(node.id);
  const isChecked = checkedIds.has(node.id);
  const isActive = activeCategoryId === node.id;

  if (node.hidden) return null;

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center py-1.5 px-2 cursor-pointer text-sm transition-colors rounded-md mx-1",
          isLeaf ? "text-slate-600 hover:bg-slate-100" : "text-slate-800 font-medium hover:bg-slate-100/80",
          isActive && isLeaf && "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isLeaf) onSelectCategory(node.title || node.label);
          else toggleExpand(node.id);
        }}
      >
        <span 
          className="mr-1.5 text-slate-400 w-4 h-4 flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); if (!isLeaf) toggleExpand(node.id); }}
        >
          {!isLeaf && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
        </span>
        <span 
          className="mr-2 text-indigo-500"
          onClick={(e) => { e.stopPropagation(); toggleCheck(node.id); }}
        >
          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        </span>
        <span 
          className={cn("mr-2", isActive ? "text-indigo-600" : "text-indigo-400")}
          onClick={(e) => { e.stopPropagation(); if (!isLeaf) toggleExpand(node.id); }}
        >
          {isLeaf ? null : (isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />)}
        </span>
        <span className="flex-1 truncate">{node.title || node.label}</span>
        {node.count !== undefined && (
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full ml-2",
            isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
          )}>
            {node.count}
          </span>
        )}
      </div>
      
      {isExpanded && !isLeaf && (
        <div className="mt-0.5">
          {node.children.map((child: any) => (
            <TreeNode 
              key={child.id} node={child} depth={depth + 1} 
              expandedIds={expandedIds} toggleExpand={toggleExpand}
              checkedIds={checkedIds} toggleCheck={toggleCheck}
              onSelectCategory={onSelectCategory}
              activeCategoryId={activeCategoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GlobalTreeSidebar() {
  const { selectedAirline, selectedCycle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState('');

  // Extract selected category from URL
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  useEffect(() => {
    let url = '/api/media';
    const params = new URLSearchParams();
    setIsLoading(true);
    setTreeData(TREE_DATA);
    const initExpanded = new Set<string>();
    const expandLevels = (nodes: any[], currentDepth: number, maxDepth: number) => {
      if (currentDepth >= maxDepth) return;
      nodes.forEach(n => {
        initExpanded.add(n.id);
        if (n.children) expandLevels(n.children, currentDepth + 1, maxDepth);
      });
    };
    expandLevels(TREE_DATA, 0, 4);
    setExpandedIds(initExpanded);
    setIsLoading(false);
  }, [selectedAirline, selectedCycle]);

  const filteredTree = useMemo(() => {
    if (!filterText) return treeData;
    
    const filterNode = (node: any): any => {
      if ((node.title || node.label).toLowerCase().includes(filterText.toLowerCase())) {
        return { ...node };
      }
      if (node.children) {
        const filteredChildren = node.children.map(filterNode).filter((n: any) => n !== null);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }
      return null;
    };

    return treeData.map(filterNode).filter(n => n !== null);
  }, [treeData, filterText]);

  useEffect(() => {
    if (filterText) {
      const newExpanded = new Set(expandedIds);
      const expandAll = (nodes: any[]) => {
        nodes.forEach(n => {
          if (n.children && n.children.length > 0) {
            newExpanded.add(n.id);
            expandAll(n.children);
          }
        });
      };
      expandAll(filteredTree);
      setExpandedIds(newExpanded);
    }
  }, [filterText, filteredTree]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const toggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const activeCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined;
    let foundId: string | undefined;
    const findId = (nodes: any[]) => {
      for (const n of nodes) {
        if (!n.children && n.label === selectedCategory) foundId = n.id;
        else if (n.children) findId(n.children);
      }
    };
    findId(treeData);
    return foundId;
  }, [selectedCategory, treeData]);

  const handleSelectCategory = (cat: string) => {
    navigate(`/home?category=${encodeURIComponent(cat)}`);
  };

  const [mediaConfig, setMediaConfig] = useState('Default');
  const [classFilter, setClassFilter] = useState('All');

  return (
    <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0 shadow-[1px_0_10px_-4px_rgba(0,0,0,0.05)] z-10">
      <div className="px-3 pt-3 pb-2 border-b border-slate-100 flex flex-col gap-2 bg-slate-50/30">
        <div className="flex gap-2">
          <select 
            value={mediaConfig} 
            onChange={e => setMediaConfig(e.target.value)}
            className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 bg-white"
          >
            <option value="Default">Config: Default</option>
            <option value="Short Haul">Config: Short Haul</option>
            <option value="Long Haul">Config: Long Haul</option>
          </select>
          <select 
            value={classFilter} 
            onChange={e => setClassFilter(e.target.value)}
            className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 bg-white"
          >
            <option value="All">Class: All</option>
            <option value="Business">Class: Business</option>
            <option value="Economy">Class: Economy</option>
            <option value="First">Class: First</option>
          </select>
        </div>
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
        />
      </div>
      <div className="flex gap-2 p-3 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-600">
        <button onClick={() => {
          const all = new Set<string>();
          const gather = (n: any[]) => n.forEach(x => { if (x.children) { all.add(x.id); gather(x.children); } });
          gather(treeData);
          setExpandedIds(all);
        }} className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-md transition-colors">Expand</button>
        <button onClick={() => setExpandedIds(new Set())} className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-md transition-colors">Collapse</button>
        <button onClick={() => setCheckedIds(new Set())} className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-md transition-colors">Deselect</button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-3">
        {isLoading ? (
          <div className="p-4 text-sm text-slate-400 text-center">Loading tree...</div>
        ) : (
          filteredTree.map(node => (
            <div key={node.id} className="mb-4">
              <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block"></span>
                {node.title || node.label}
              </div>
              {node.children && node.children.map((child: any) => (
                <TreeNode 
                  key={child.id} node={child} depth={0} 
                  expandedIds={expandedIds} toggleExpand={toggleExpand}
                  checkedIds={checkedIds} toggleCheck={toggleCheck}
                  onSelectCategory={handleSelectCategory}
                  activeCategoryId={activeCategoryId}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
