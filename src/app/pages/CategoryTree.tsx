import React, { useState, useMemo } from "react";
import {
  FolderTree, ChevronRight, ChevronDown, CheckCircle2, XCircle, Search,
  MoreHorizontal, Download, Eye, RefreshCw, Upload, FolderPlus,
  AlertTriangle, Shield, Layers, GitBranch, Copy,
  Trash2, Edit3, ArrowUpDown, FileWarning, Clock,
  Plus, ChevronLeft, ChevronsLeft, ChevronsRight,
  Lock, Unlock, EyeOff, Settings2, MoreVertical,
  Filter, Move, ArrowUp, ArrowDown, Globe, Tag,
  Image as ImageIcon, Film, Mic, Type, Gamepad2, BookOpen,
  Headphones, Package, Info, AlertCircle, Columns3,
  GripVertical, ExternalLink, FolderOpen, FolderClosed,
  Ban, Workflow
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ─── Types ───
export interface TreeNodeData {
  id: string;
  title: string;
  code: string;
  count?: number;
  totalCount?: number;
  status?: "normal" | "warning" | "error";
  locked?: "none" | "partial" | "full";
  disabled?: boolean;
  virtual?: boolean;
  hasAdaptation?: boolean;
  children?: TreeNodeData[];
}

interface StatusRow {
  id: string;
  name: string;
  uid: string;
  type: string;
  subType: string;
  duration: string;
  language: string;
  arrangement: boolean;
  trailer: boolean;
  imageStatus: "full" | "partial" | "missing";
  subtitleCount: string;
  audioTrackCount: string;
  signStatus: "未签核" | "初始签核" | "全量签核";
  version: string;
  anomaly: "none" | "warning" | "error";
  anomalyDetails: string[];
  onlineTime: string;
  offlineTime: string;
  source: string;
  sortOrder: number;
  provider: string;
  completeness: number;
}

// ─── Mock Data ───
const CATEGORY_SETS = [
  { id: "CS-001", name: "2026-Q1 国际航线分类集", status: "生效", nodes: 48, contents: 272 },
  { id: "CS-002", name: "2025-Q4 分类集 (存档)", status: "已归档", nodes: 42, contents: 245 },
  { id: "CS-003", name: "2026-Q2 规划分类集", status: "草案", nodes: 12, contents: 0 },
];

export const TREE_DATA: TreeNodeData[] = [
  {
    "id": "2paht86rw",
    "title": "BGM",
    "code": "HU-0-0-0-0",
    "status": "normal",
    "count": 28,
    "totalCount": 28
  },
  {
    "id": "dr1glcah8",
    "title": "Audio PA",
    "code": "HU-0-0-0-1",
    "status": "normal",
    "count": 3,
    "totalCount": 3
  },
  {
    "id": "wcfz0kll7",
    "title": "welcome_video",
    "code": "HU-0-0-0-2",
    "status": "normal",
    "count": 5,
    "totalCount": 5
  },
  {
    "id": "dqlkoxt1b",
    "title": "Video PA",
    "code": "HU-0-0-0-3",
    "status": "normal",
    "count": 49,
    "totalCount": 49
  },
  {
    "id": "np3gfrt9s",
    "title": "Overhead",
    "code": "HU-0-0-0-4",
    "status": "normal",
    "count": 40,
    "totalCount": 40
  },
  {
    "id": "df4og8gb6",
    "title": "Broadcast",
    "code": "HU-0-0-0-5",
    "status": "normal",
    "count": 49,
    "totalCount": 49
  },
  {
    "id": "7kyfwlbui",
    "title": "flightScript",
    "code": "HU-0-0-0-6",
    "status": "normal",
    "count": 35,
    "totalCount": 35,
    "children": [
      {
        "id": "smqsboxwp",
        "title": "Boarding_Phase",
        "code": "HU-0-0-0-6-0",
        "status": "normal",
        "count": 0,
        "totalCount": 0
      }
    ]
  },
  {
    "id": "szm6hih5p",
    "title": "Main Menu",
    "code": "HU-0-0-0-7",
    "status": "normal",
    "count": 16,
    "totalCount": 16,
    "children": [
      {
        "id": "bc4i4jq80",
        "title": "Movies",
        "code": "HU-0-0-0-7-0",
        "status": "normal",
        "count": 28,
        "totalCount": 28,
        "children": [
          {
            "id": "bcbfrisbn",
            "title": "New Expedition",
            "code": "HU-0-0-0-7-0-0",
            "status": "normal",
            "count": 3,
            "totalCount": 3
          },
          {
            "id": "7ao01b18v",
            "title": "Chinese Cinema",
            "code": "HU-0-0-0-7-0-1",
            "status": "normal",
            "count": 35,
            "totalCount": 35
          },
          {
            "id": "s3v1bn5an",
            "title": "Hong Kong Classics",
            "code": "HU-0-0-0-7-0-2",
            "status": "normal",
            "count": 6,
            "totalCount": 6
          },
          {
            "id": "8nzj0bu0g",
            "title": "Made in Hollywood",
            "code": "HU-0-0-0-7-0-3",
            "status": "normal",
            "count": 18,
            "totalCount": 18
          },
          {
            "id": "6iwpmtfpv",
            "title": "Hollywood Classics",
            "code": "HU-0-0-0-7-0-4",
            "status": "normal",
            "count": 2,
            "totalCount": 2
          },
          {
            "id": "8si7v8ytn",
            "title": "Asian Story",
            "code": "HU-0-0-0-7-0-5",
            "status": "normal",
            "count": 33,
            "totalCount": 33
          },
          {
            "id": "xs1jlsv7a",
            "title": "European Perspective",
            "code": "HU-0-0-0-7-0-6",
            "status": "normal",
            "count": 31,
            "totalCount": 31
          },
          {
            "id": "bhddhihcs",
            "title": "Awards Showcase",
            "code": "HU-0-0-0-7-0-7",
            "status": "normal",
            "count": 41,
            "totalCount": 41
          },
          {
            "id": "njfaj385w",
            "title": "Assembly of Adorable Pets",
            "code": "HU-0-0-0-7-0-8",
            "status": "normal",
            "count": 46,
            "totalCount": 46
          },
          {
            "id": "sdv06o8f1",
            "title": "Gotham Dark Knight",
            "code": "HU-0-0-0-7-0-9",
            "status": "normal",
            "count": 13,
            "totalCount": 13
          },
          {
            "id": "um1icom06",
            "title": "Marvel Movies",
            "code": "HU-0-0-0-7-0-10",
            "status": "normal",
            "count": 23,
            "totalCount": 23
          },
          {
            "id": "awso50m1a",
            "title": "Racing Family",
            "code": "HU-0-0-0-7-0-11",
            "status": "normal",
            "count": 20,
            "totalCount": 20
          },
          {
            "id": "h5uhscagk",
            "title": "Family-friendly",
            "code": "HU-0-0-0-7-0-12",
            "status": "normal",
            "count": 11,
            "totalCount": 11
          },
          {
            "id": "u8oyvyo52",
            "title": "Sci-Fi/Fantasy",
            "code": "HU-0-0-0-7-0-13",
            "status": "normal",
            "count": 29,
            "totalCount": 29
          },
          {
            "id": "1x9j3t60j",
            "title": "Bollywood Movies",
            "code": "HU-0-0-0-7-0-14",
            "status": "normal",
            "count": 40,
            "totalCount": 40
          }
        ]
      },
      {
        "id": "txd20ovje",
        "title": "TV Series",
        "code": "HU-0-0-0-7-1",
        "status": "normal",
        "count": 29,
        "totalCount": 29,
        "children": [
          {
            "id": "1gw6kmzte",
            "title": "YOUKU",
            "code": "HU-0-0-0-7-1-0",
            "status": "normal",
            "count": 11,
            "totalCount": 11
          },
          {
            "id": "eyna0vp9g",
            "title": "Chinese",
            "code": "HU-0-0-0-7-1-1",
            "status": "normal",
            "count": 25,
            "totalCount": 25
          },
          {
            "id": "0p8e2hign",
            "title": "British",
            "code": "HU-0-0-0-7-1-2",
            "status": "normal",
            "count": 2,
            "totalCount": 2
          },
          {
            "id": "qs1nbkx6x",
            "title": "American",
            "code": "HU-0-0-0-7-1-3",
            "status": "normal",
            "count": 40,
            "totalCount": 40
          },
          {
            "id": "67cw5snzf",
            "title": "Asian",
            "code": "HU-0-0-0-7-1-4",
            "status": "normal",
            "count": 12,
            "totalCount": 12
          },
          {
            "id": "pbyazwxh2",
            "title": "English Comedy",
            "code": "HU-0-0-0-7-1-5",
            "status": "normal",
            "count": 27,
            "totalCount": 27
          },
          {
            "id": "gvynxdtlb",
            "title": "English TV Series",
            "code": "HU-0-0-0-7-1-6",
            "status": "normal",
            "count": 13,
            "totalCount": 13
          }
        ]
      },
      {
        "id": "gzxu57b98",
        "title": "Documentary",
        "code": "HU-0-0-0-7-2",
        "status": "normal",
        "count": 23,
        "totalCount": 23,
        "children": [
          {
            "id": "ppf1ni183",
            "title": "CCTV",
            "code": "HU-0-0-0-7-2-0",
            "status": "normal",
            "count": 31,
            "totalCount": 31
          },
          {
            "id": "91r08o8fo",
            "title": "BBC",
            "code": "HU-0-0-0-7-2-1",
            "status": "normal",
            "count": 6,
            "totalCount": 6
          },
          {
            "id": "b1kddayni",
            "title": "Discovery",
            "code": "HU-0-0-0-7-2-2",
            "status": "normal",
            "count": 14,
            "totalCount": 14
          },
          {
            "id": "1xqura2qr",
            "title": "Universal Vision",
            "code": "HU-0-0-0-7-2-3",
            "status": "normal",
            "count": 24,
            "totalCount": 24
          },
          {
            "id": "ykrstkgyc",
            "title": "National Geographic",
            "code": "HU-0-0-0-7-2-4",
            "status": "normal",
            "count": 35,
            "totalCount": 35
          }
        ]
      },
      {
        "id": "dfgbas3xe",
        "title": "Entertainment",
        "code": "HU-0-0-0-7-3",
        "status": "normal",
        "count": 42,
        "totalCount": 42,
        "children": [
          {
            "id": "q96dft1ue",
            "title": "New Era",
            "code": "HU-0-0-0-7-3-0",
            "status": "normal",
            "count": 18,
            "totalCount": 18
          },
          {
            "id": "0i5pq2svd",
            "title": "Culture/Art",
            "code": "HU-0-0-0-7-3-1",
            "status": "normal",
            "count": 13,
            "totalCount": 13
          },
          {
            "id": "f99rx62mc",
            "title": "Sport",
            "code": "HU-0-0-0-7-3-2",
            "status": "normal",
            "count": 48,
            "totalCount": 48
          },
          {
            "id": "xhe38xo8y",
            "title": "Gourmet Food/ Travel",
            "code": "HU-0-0-0-7-3-3",
            "status": "normal",
            "count": 37,
            "totalCount": 37
          },
          {
            "id": "ryohvie85",
            "title": "Entertainment",
            "code": "HU-0-0-0-7-3-4",
            "status": "normal",
            "count": 42,
            "totalCount": 42
          },
          {
            "id": "fv8d9v3pr",
            "title": "Fashion",
            "code": "HU-0-0-0-7-3-5",
            "status": "normal",
            "count": 14,
            "totalCount": 14
          },
          {
            "id": "7jj1ig1u9",
            "title": "New Chapter",
            "code": "HU-0-0-0-7-3-6",
            "status": "normal",
            "count": 20,
            "totalCount": 20
          },
          {
            "id": "myhehs91w",
            "title": "Winter Sports",
            "code": "HU-0-0-0-7-3-7",
            "status": "normal",
            "count": 19,
            "totalCount": 19
          },
          {
            "id": "qunjvpvoh",
            "title": "E-Sport",
            "code": "HU-0-0-0-7-3-8",
            "status": "normal",
            "count": 43,
            "totalCount": 43
          }
        ]
      },
      {
        "id": "capcjyahc",
        "title": "Music",
        "code": "HU-0-0-0-7-4",
        "status": "normal",
        "count": 4,
        "totalCount": 4,
        "children": [
          {
            "id": "757w2olf1",
            "title": "Fanshu",
            "code": "HU-0-0-0-7-4-0",
            "status": "normal",
            "count": 17,
            "totalCount": 17,
            "children": [
              {
                "id": "4ntacuo2v",
                "title": "ALL",
                "code": "HU-0-0-0-7-4-0-0",
                "status": "normal",
                "count": 3,
                "totalCount": 3
              }
            ]
          },
          {
            "id": "1h2fm6tef",
            "title": "Ranking List",
            "code": "HU-0-0-0-7-4-1",
            "status": "normal",
            "count": 35,
            "totalCount": 35,
            "children": [
              {
                "id": "5fg8td3oy",
                "title": "ALL",
                "code": "HU-0-0-0-7-4-1-0",
                "status": "normal",
                "count": 27,
                "totalCount": 27
              }
            ]
          },
          {
            "id": "imf40ae09",
            "title": "The Chinese Dream",
            "code": "HU-0-0-0-7-4-2",
            "status": "normal",
            "count": 22,
            "totalCount": 22,
            "children": [
              {
                "id": "10gha1gbm",
                "title": "ALL",
                "code": "HU-0-0-0-7-4-2-0",
                "status": "normal",
                "count": 9,
                "totalCount": 9
              }
            ]
          },
          {
            "id": "wv4mzhf94",
            "title": "Pop",
            "code": "HU-0-0-0-7-4-3",
            "status": "normal",
            "count": 19,
            "totalCount": 19,
            "children": [
              {
                "id": "ay6s5fi1c",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-3-0",
                "status": "normal",
                "count": 21,
                "totalCount": 21
              },
              {
                "id": "80f87qhde",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-3-1",
                "status": "normal",
                "count": 11,
                "totalCount": 11
              },
              {
                "id": "1ba043kso",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-3-2",
                "status": "normal",
                "count": 32,
                "totalCount": 32
              },
              {
                "id": "rgdv101gt",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-3-3",
                "status": "normal",
                "count": 16,
                "totalCount": 16
              },
              {
                "id": "wvkhfoldq",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-3-4",
                "status": "normal",
                "count": 17,
                "totalCount": 17
              }
            ]
          },
          {
            "id": "6pklmx52n",
            "title": "Rock",
            "code": "HU-0-0-0-7-4-4",
            "status": "normal",
            "count": 29,
            "totalCount": 29,
            "children": [
              {
                "id": "toc6i2djx",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-4-0",
                "status": "normal",
                "count": 47,
                "totalCount": 47
              },
              {
                "id": "0mryirzhv",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-4-1",
                "status": "normal",
                "count": 45,
                "totalCount": 45
              },
              {
                "id": "m2zrybuvx",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-4-2",
                "status": "normal",
                "count": 0,
                "totalCount": 0
              },
              {
                "id": "do70gay8x",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-4-3",
                "status": "normal",
                "count": 6,
                "totalCount": 6
              },
              {
                "id": "puneqzxg9",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-4-4",
                "status": "normal",
                "count": 24,
                "totalCount": 24
              }
            ]
          },
          {
            "id": "s82jtil2z",
            "title": "Electronic",
            "code": "HU-0-0-0-7-4-5",
            "status": "normal",
            "count": 47,
            "totalCount": 47,
            "children": [
              {
                "id": "2qcklcw5e",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-5-0",
                "status": "normal",
                "count": 11,
                "totalCount": 11
              },
              {
                "id": "1y3u3vt21",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-5-1",
                "status": "normal",
                "count": 1,
                "totalCount": 1
              },
              {
                "id": "745p2trr2",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-5-2",
                "status": "normal",
                "count": 20,
                "totalCount": 20
              },
              {
                "id": "6vtlqcg5o",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-5-3",
                "status": "normal",
                "count": 15,
                "totalCount": 15
              },
              {
                "id": "eofd8eevw",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-5-4",
                "status": "normal",
                "count": 21,
                "totalCount": 21
              }
            ]
          },
          {
            "id": "3zc2xs0am",
            "title": "Classical",
            "code": "HU-0-0-0-7-4-6",
            "status": "normal",
            "count": 9,
            "totalCount": 9,
            "children": [
              {
                "id": "5xhc9rg50",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-6-0",
                "status": "normal",
                "count": 40,
                "totalCount": 40
              },
              {
                "id": "0kzka0rn7",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-6-1",
                "status": "normal",
                "count": 9,
                "totalCount": 9
              },
              {
                "id": "mnv9oqloy",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-6-2",
                "status": "normal",
                "count": 14,
                "totalCount": 14
              },
              {
                "id": "qw027z6lx",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-6-3",
                "status": "normal",
                "count": 3,
                "totalCount": 3
              },
              {
                "id": "at6snzcd0",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-6-4",
                "status": "normal",
                "count": 29,
                "totalCount": 29
              }
            ]
          },
          {
            "id": "rqydm3ipa",
            "title": "Country",
            "code": "HU-0-0-0-7-4-7",
            "status": "normal",
            "count": 39,
            "totalCount": 39,
            "children": [
              {
                "id": "awsw0t7oi",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-7-0",
                "status": "normal",
                "count": 24,
                "totalCount": 24
              },
              {
                "id": "bdsch2p3i",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-7-1",
                "status": "normal",
                "count": 37,
                "totalCount": 37
              },
              {
                "id": "qmqbubimh",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-7-2",
                "status": "normal",
                "count": 20,
                "totalCount": 20
              },
              {
                "id": "2ud1kql12",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-7-3",
                "status": "normal",
                "count": 42,
                "totalCount": 42
              },
              {
                "id": "s1y9vnmpr",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-7-4",
                "status": "normal",
                "count": 48,
                "totalCount": 48
              }
            ]
          },
          {
            "id": "vz73wif54",
            "title": "Jazz",
            "code": "HU-0-0-0-7-4-8",
            "status": "normal",
            "count": 26,
            "totalCount": 26,
            "children": [
              {
                "id": "3yy5ui62c",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-8-0",
                "status": "normal",
                "count": 38,
                "totalCount": 38
              },
              {
                "id": "ctyx6aky9",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-8-1",
                "status": "normal",
                "count": 49,
                "totalCount": 49
              },
              {
                "id": "djw4pzicy",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-8-2",
                "status": "normal",
                "count": 33,
                "totalCount": 33
              },
              {
                "id": "1ay2di2fk",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-8-3",
                "status": "normal",
                "count": 39,
                "totalCount": 39
              },
              {
                "id": "put8a7t8b",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-8-4",
                "status": "normal",
                "count": 25,
                "totalCount": 25
              }
            ]
          },
          {
            "id": "6pgr6dnt3",
            "title": "Folk",
            "code": "HU-0-0-0-7-4-9",
            "status": "normal",
            "count": 9,
            "totalCount": 9,
            "children": [
              {
                "id": "ibzgwzguy",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-9-0",
                "status": "normal",
                "count": 10,
                "totalCount": 10
              },
              {
                "id": "cdf3nocio",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-9-1",
                "status": "normal",
                "count": 38,
                "totalCount": 38
              },
              {
                "id": "qkv03titx",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-9-2",
                "status": "normal",
                "count": 25,
                "totalCount": 25
              },
              {
                "id": "4b3m57r96",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-9-3",
                "status": "normal",
                "count": 26,
                "totalCount": 26
              },
              {
                "id": "r444aa1bs",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-9-4",
                "status": "normal",
                "count": 2,
                "totalCount": 2
              }
            ]
          },
          {
            "id": "y50yjvaou",
            "title": "Relaxation",
            "code": "HU-0-0-0-7-4-10",
            "status": "normal",
            "count": 20,
            "totalCount": 20,
            "children": [
              {
                "id": "jmgev0lz0",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-10-0",
                "status": "normal",
                "count": 33,
                "totalCount": 33
              },
              {
                "id": "aumqa2ws4",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-10-1",
                "status": "normal",
                "count": 5,
                "totalCount": 5
              },
              {
                "id": "44ugfly7s",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-10-2",
                "status": "normal",
                "count": 0,
                "totalCount": 0
              },
              {
                "id": "m0vdv82d0",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-10-3",
                "status": "normal",
                "count": 48,
                "totalCount": 48
              },
              {
                "id": "b2vs3528l",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-10-4",
                "status": "normal",
                "count": 0,
                "totalCount": 0
              }
            ]
          },
          {
            "id": "u8vjd29jm",
            "title": "Chinese Traditional",
            "code": "HU-0-0-0-7-4-11",
            "status": "normal",
            "count": 6,
            "totalCount": 6,
            "children": [
              {
                "id": "ol0w58ooo",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-11-0",
                "status": "normal",
                "count": 2,
                "totalCount": 2
              },
              {
                "id": "xnkkukad9",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-11-1",
                "status": "normal",
                "count": 46,
                "totalCount": 46
              },
              {
                "id": "ctv6sl0bh",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-11-2",
                "status": "normal",
                "count": 15,
                "totalCount": 15
              },
              {
                "id": "42qbw1bns",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-11-3",
                "status": "normal",
                "count": 41,
                "totalCount": 41
              },
              {
                "id": "ma0m704gy",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-11-4",
                "status": "normal",
                "count": 13,
                "totalCount": 13
              }
            ]
          },
          {
            "id": "qsrjays6q",
            "title": "World",
            "code": "HU-0-0-0-7-4-12",
            "status": "normal",
            "count": 21,
            "totalCount": 21,
            "children": [
              {
                "id": "g9s9dwmxe",
                "title": "A - C",
                "code": "HU-0-0-0-7-4-12-0",
                "status": "normal",
                "count": 31,
                "totalCount": 31
              },
              {
                "id": "2k03fl7mc",
                "title": "D - G",
                "code": "HU-0-0-0-7-4-12-1",
                "status": "normal",
                "count": 17,
                "totalCount": 17
              },
              {
                "id": "jerwkl56e",
                "title": "H - M",
                "code": "HU-0-0-0-7-4-12-2",
                "status": "normal",
                "count": 48,
                "totalCount": 48
              },
              {
                "id": "40zeeh6zl",
                "title": "N - T",
                "code": "HU-0-0-0-7-4-12-3",
                "status": "normal",
                "count": 42,
                "totalCount": 42
              },
              {
                "id": "ug7qe5l9g",
                "title": "U - Z",
                "code": "HU-0-0-0-7-4-12-4",
                "status": "normal",
                "count": 42,
                "totalCount": 42
              }
            ]
          },
          {
            "id": "utykmpw6l",
            "title": "Kids",
            "code": "HU-0-0-0-7-4-13",
            "status": "normal",
            "count": 20,
            "totalCount": 20
          }
        ]
      },
      {
        "id": "4cvxnv5yf",
        "title": "Kid's World",
        "code": "HU-0-0-0-7-5",
        "status": "normal",
        "count": 10,
        "totalCount": 10,
        "children": [
          {
            "id": "hfesrnkx8",
            "title": "Movies",
            "code": "HU-0-0-0-7-5-0",
            "status": "normal",
            "count": 38,
            "totalCount": 38
          },
          {
            "id": "2cd0g4v2g",
            "title": "TV",
            "code": "HU-0-0-0-7-5-1",
            "status": "normal",
            "count": 0,
            "totalCount": 0
          },
          {
            "id": "a8pl0wkfp",
            "title": "Music",
            "code": "HU-0-0-0-7-5-2",
            "status": "normal",
            "count": 14,
            "totalCount": 14
          },
          {
            "id": "ebwazdb8r",
            "title": "Games",
            "code": "HU-0-0-0-7-5-3",
            "status": "normal",
            "count": 1,
            "totalCount": 1
          }
        ]
      },
      {
        "id": "bw7nz2w0c",
        "title": "Staff Demeanor",
        "code": "HU-0-0-0-7-6",
        "status": "normal",
        "count": 19,
        "totalCount": 19
      },
      {
        "id": "rxedly53i",
        "title": "Flight Map",
        "code": "HU-0-0-0-7-7",
        "status": "normal",
        "count": 13,
        "totalCount": 13
      },
      {
        "id": "na7jnsxzo",
        "title": "Games",
        "code": "HU-0-0-0-7-8",
        "status": "normal",
        "count": 33,
        "totalCount": 33
      },
      {
        "id": "d0npdy0ah",
        "title": "Travel Info",
        "code": "HU-0-0-0-7-9",
        "status": "normal",
        "count": 33,
        "totalCount": 33,
        "children": [
          {
            "id": "moit77cba",
            "title": "Customs & Immigration",
            "code": "HU-0-0-0-7-9-0",
            "status": "normal",
            "count": 19,
            "totalCount": 19
          },
          {
            "id": "9xbxmjppm",
            "title": "Destination Info",
            "code": "HU-0-0-0-7-9-1",
            "status": "normal",
            "count": 4,
            "totalCount": 4
          },
          {
            "id": "70bawfdnf",
            "title": "Travel & Relaxation",
            "code": "HU-0-0-0-7-9-2",
            "status": "normal",
            "count": 40,
            "totalCount": 40
          }
        ]
      },
      {
        "id": "ecz7zkmnq",
        "title": "Seat Chat",
        "code": "HU-0-0-0-7-10",
        "status": "normal",
        "count": 2,
        "totalCount": 2
      },
      {
        "id": "xs2t3kf5h",
        "title": "Shopping",
        "code": "HU-0-0-0-7-11",
        "status": "normal",
        "count": 3,
        "totalCount": 3
      },
      {
        "id": "m2p7j7for",
        "title": "About Us",
        "code": "HU-0-0-0-7-12",
        "status": "normal",
        "count": 47,
        "totalCount": 47
      },
      {
        "id": "lvokyvl7g",
        "title": "Connecting Gate",
        "code": "HU-0-0-0-7-13",
        "status": "normal",
        "count": 38,
        "totalCount": 38
      }
    ]
  },
  {
    "id": "q7x3qcwsu",
    "title": "Crew Image",
    "code": "HU-0-0-0-8",
    "status": "normal",
    "count": 14,
    "totalCount": 14
  },
  {
    "id": "ybv4wf6qd",
    "title": "OneMedia",
    "code": "HU-0-0-0-9",
    "status": "normal",
    "count": 32,
    "totalCount": 32,
    "children": [
      {
        "id": "4hf97urqc",
        "title": "VHS Images",
        "code": "HU-0-0-0-9-0",
        "status": "normal",
        "count": 3,
        "totalCount": 3
      },
      {
        "id": "9abbca3qw",
        "title": "AD_Videos",
        "code": "HU-0-0-0-9-1",
        "status": "normal",
        "count": 37,
        "totalCount": 37
      }
    ]
  }
];

function generateStatusRows(): StatusRow[] {
  const data: StatusRow[] = [
    { id: "V-10023", name: "流浪地球 3", uid: "VID-2026-10023", type: "视频", subType: "电影", duration: "02:28:15", language: "中文", arrangement: true, trailer: false, imageStatus: "partial", subtitleCount: "2/3", audioTrackCount: "2/2", signStatus: "初始签核", version: "V2", anomaly: "warning", anomalyDetails: ["ERR-003 缺失预告素材", "ERR-013 缺失必需字幕(韩语)"], onlineTime: "2026-03-01", offlineTime: "2027-03-01", source: "Disney+", sortOrder: 1, provider: "Disney+", completeness: 75 },
    { id: "G-49210", name: "原神 (V5.0)", uid: "GAM-2026-49210", type: "游戏", subType: "休闲游戏", duration: "-", language: "中文", arrangement: true, trailer: true, imageStatus: "full", subtitleCount: "-", audioTrackCount: "1/1", signStatus: "全量签核", version: "V3", anomaly: "none", anomalyDetails: [], onlineTime: "2026-03-01", offlineTime: "2027-06-01", source: "miHoYo", sortOrder: 2, provider: "miHoYo", completeness: 100 },
    { id: "A-88321", name: "周杰伦 - 稻香 (Live)", uid: "AUD-2026-88321", type: "音频", subType: "单曲", duration: "00:04:32", language: "中文", arrangement: true, trailer: false, imageStatus: "full", subtitleCount: "-", audioTrackCount: "2/2", signStatus: "全量签核", version: "V1", anomaly: "none", anomalyDetails: [], onlineTime: "2026-02-15", offlineTime: "2027-02-15", source: "Sony Music", sortOrder: 3, provider: "Sony Music", completeness: 100 },
    { id: "V-10045", name: "三体 第1集", uid: "VID-2026-10045", type: "视频", subType: "剧集", duration: "00:52:00", language: "中文", arrangement: true, trailer: true, imageStatus: "full", subtitleCount: "2/3", audioTrackCount: "1/2", signStatus: "初始签核", version: "V2", anomaly: "error", anomalyDetails: ["ERR-014 缺失必需音轨(英语)", "ERR-013 缺失必需字幕(日语)"], onlineTime: "2026-03-10", offlineTime: "2027-03-10", source: "Tencent Video", sortOrder: 4, provider: "Tencent Video", completeness: 85 },
    { id: "V-10046", name: "三体 第2集", uid: "VID-2026-10046", type: "视频", subType: "剧集", duration: "00:48:30", language: "中文", arrangement: true, trailer: true, imageStatus: "full", subtitleCount: "3/3", audioTrackCount: "2/2", signStatus: "全量签核", version: "V3", anomaly: "none", anomalyDetails: [], onlineTime: "2026-03-10", offlineTime: "2027-03-10", source: "Tencent Video", sortOrder: 5, provider: "Tencent Video", completeness: 100 },
    { id: "B-22910", name: "哈利波特有声书 Ch.1-5", uid: "AUB-2026-22910", type: "有声书", subType: "有声读物", duration: "05:12:00", language: "English", arrangement: true, trailer: false, imageStatus: "full", subtitleCount: "-", audioTrackCount: "1/1", signStatus: "全量签核", version: "V1", anomaly: "none", anomalyDetails: [], onlineTime: "2026-02-01", offlineTime: "2027-06-01", source: "Audible", sortOrder: 6, provider: "Audible", completeness: 100 },
    { id: "S-55102", name: "天气预报组件", uid: "SRV-2026-55102", type: "服务类", subType: "功能服务", duration: "-", language: "中文", arrangement: false, trailer: false, imageStatus: "missing", subtitleCount: "-", audioTrackCount: "-", signStatus: "未签核", version: "V1", anomaly: "error", anomalyDetails: ["ERR-009 内容类型与分类不匹配", "ERR-002 缺失必需图片", "ERR-001 未挂分类(仅在兜底节点)"], onlineTime: "-", offlineTime: "-", source: "Internal", sortOrder: 7, provider: "Internal", completeness: 40 },
    { id: "V-10050", name: "封神：朝歌风云", uid: "VID-2026-10050", type: "视频", subType: "电影", duration: "02:15:00", language: "中文", arrangement: true, trailer: true, imageStatus: "full", subtitleCount: "2/4", audioTrackCount: "2/2", signStatus: "初始签核", version: "V2", anomaly: "warning", anomalyDetails: ["ERR-013 缺失必需字幕(韩语,法语)"], onlineTime: "2026-04-01", offlineTime: "2027-04-01", source: "iQIYI", sortOrder: 8, provider: "iQIYI", completeness: 90 },
    { id: "V-10051", name: "唐人街探案4", uid: "VID-2026-10051", type: "视频", subType: "电影", duration: "02:02:30", language: "中文", arrangement: true, trailer: true, imageStatus: "full", subtitleCount: "3/3", audioTrackCount: "2/2", signStatus: "全量签核", version: "V3", anomaly: "none", anomalyDetails: [], onlineTime: "2026-03-01", offlineTime: "2027-03-01", source: "Wanda Pictures", sortOrder: 9, provider: "Wanda Pictures", completeness: 100 },
    { id: "V-10060", name: "寂静之地3", uid: "VID-2026-10060", type: "视频", subType: "电影", duration: "01:45:00", language: "English", arrangement: false, trailer: false, imageStatus: "missing", subtitleCount: "0/3", audioTrackCount: "0/2", signStatus: "未签核", version: "-", anomaly: "error", anomalyDetails: ["ERR-004 缺失编排关联", "ERR-003 缺失预告素材", "ERR-002 缺失必需图片", "ERR-018 文件信息缺失"], onlineTime: "-", offlineTime: "-", source: "Paramount", sortOrder: 10, provider: "Paramount", completeness: 20 },
  ];
  return data;
}

const ALL_STATUS_ROWS = generateStatusRows();

// ─── Main Component ───
export function CategoryTreeLayout() {
  const [selectedNode, setSelectedNode] = useState("n1-1");
  const [selectedCategorySet, setSelectedCategorySet] = useState(CATEGORY_SETS[0]);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [nodeEditorTab, setNodeEditorTab] = useState<"basic" | "rules" | "adapt" | "lang" | "display" | "log">("basic");
  const [includeSubCategories, setIncludeSubCategories] = useState(false);
  const [filterStatus, setFilterStatus] = useState("全部");
  const [filterType, setFilterType] = useState("全部");
  const [filterSignoff, setFilterSignoff] = useState("全部");
  const [filterAnomaly, setFilterAnomaly] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [treeSearch, setTreeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [hoveredAnomaly, setHoveredAnomaly] = useState<string | null>(null);
  const pageSize = 10;

  const nodeInfo = findNode(TREE_DATA, selectedNode);
  const nodeLabel = nodeInfo?.title || "分类节点";
  const nodePath = findNodePath(TREE_DATA, selectedNode);

  // Stats
  const stats = useMemo(() => {
    const rows = ALL_STATUS_ROWS;
    return {
      total: nodeInfo?.count || 0,
      totalWithSub: nodeInfo?.totalCount || 0,
      normal: rows.filter(r => r.anomaly === "none").length,
      warning: rows.filter(r => r.anomaly === "warning").length,
      error: rows.filter(r => r.anomaly === "error").length,
      unsigned: rows.filter(r => r.signStatus === "未签核").length,
      initialSigned: rows.filter(r => r.signStatus === "初始签核").length,
      fullSigned: rows.filter(r => r.signStatus === "全量签核").length,
      imageMissing: rows.filter(r => r.imageStatus !== "full").length,
      noArrangement: rows.filter(r => !r.arrangement).length,
    };
  }, [selectedNode]);

  // Filter
  const filteredRows = useMemo(() => {
    let rows = ALL_STATUS_ROWS;
    if (filterType !== "全部") rows = rows.filter(r => r.type === filterType);
    if (filterSignoff !== "全部") rows = rows.filter(r => r.signStatus === filterSignoff);
    if (filterAnomaly === "无异常") rows = rows.filter(r => r.anomaly === "none");
    else if (filterAnomaly === "存在警告") rows = rows.filter(r => r.anomaly === "warning");
    else if (filterAnomaly === "存在错误") rows = rows.filter(r => r.anomaly === "error");
    if (searchText) {
      const q = searchText.toLowerCase();
      rows = rows.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.uid.toLowerCase().includes(q));
    }
    return rows;
  }, [filterType, filterSignoff, filterAnomaly, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selectedRows.size === pagedRows.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(pagedRows.map(r => r.id)));
  };

  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
  };

  return (
    <div className="flex h-full bg-white" onClick={() => contextMenu && setContextMenu(null)}>
      {/* ── Left Tree Panel ── */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50/30 shrink-0">
        {/* Category Set Selector */}
        <div className="p-3 border-b border-gray-100 bg-white shrink-0">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">当前分类集</label>
          <select value={selectedCategorySet.id} onChange={e => setSelectedCategorySet(CATEGORY_SETS.find(c => c.id === e.target.value) || CATEGORY_SETS[0])}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-indigo-500 truncate">
            {CATEGORY_SETS.map(cs => <option key={cs.id} value={cs.id}>{cs.name} ({cs.status})</option>)}
          </select>
        </div>

        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-xs text-gray-800 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            <FolderTree className="w-3.5 h-3.5 text-indigo-500" /> 分类树
          </h3>
          <div className="flex gap-0.5">
            <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="新增分类"><FolderPlus className="w-3.5 h-3.5" /></button>
            <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="全部展开"><Columns3 className="w-3.5 h-3.5" /></button>
            <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="刷新"><RefreshCw className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="relative mb-2">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={treeSearch} onChange={e => setTreeSearch(e.target.value)}
              placeholder="搜索分类名称/编码..."
              className="w-full h-7 pl-7 pr-3 text-[11px] bg-white border border-gray-200 rounded focus:border-indigo-500 outline-none transition-colors" />
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-1.5 mb-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />正常</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />警告</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />错误</span>
            <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5" />锁定</span>
            <span className="flex items-center gap-1 border-b border-dashed border-gray-400">虚拟</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-10 space-y-0.5 text-[12px]">
          {TREE_DATA.map(node => (
            <TreeNodeComp key={node.id} node={node} selectedId={selectedNode} onSelect={id => { setSelectedNode(id); setCurrentPage(1); setSelectedRows(new Set()); }}
              onContextMenu={handleContextMenu} search={treeSearch}
              defaultExpanded={["root", "n1", "n1-1", "n1-2", "n1-3", "n1-6"]} />
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Context Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 shrink-0">
          <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
            <div>
              <h2 className="text-base text-gray-900 flex items-center gap-2" style={{ fontWeight: 700 }}>
                {nodeLabel}
                {nodeInfo?.locked === "full" && <Lock className="w-3.5 h-3.5 text-red-500" />}
                {nodeInfo?.locked === "partial" && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                {nodeInfo?.virtual && <span className="text-[10px] px-1.5 py-0.5 border border-dashed border-gray-400 text-gray-500 rounded">虚拟</span>}
                {nodeInfo?.hasAdaptation && <span className="text-[10px] px-1 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded">适</span>}
              </h2>
              {/* Breadcrumb path */}
              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 flex-wrap">
                <GitBranch className="w-3 h-3 shrink-0" />
                {nodePath.map((p, i) => (
                  <React.Fragment key={p.id}>
                    {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
                    <button className="hover:text-indigo-600 transition-colors" onClick={() => setSelectedNode(p.id)}>{p.title}</button>
                  </React.Fragment>
                ))}
              </div>
              {nodeInfo?.code && <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">编码: {nodeInfo.code}</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowNodeEditor(!showNodeEditor)} className="px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                <Settings2 className="w-3.5 h-3.5" /> 节点属性
              </button>
              <button className="px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                <Upload className="w-3.5 h-3.5" /> 批量挂类
              </button>
              <button className="px-2.5 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                <RefreshCw className="w-3.5 h-3.5" /> 执行校验
              </button>
              <button className="px-2.5 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm" style={{ fontWeight: 500 }}>
                <Download className="w-3.5 h-3.5" /> 导出清单
              </button>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <StatPill label="总计" value={stats.totalWithSub} sub={`直接 ${stats.total}`} />
            <StatPill label="正常" value={stats.normal} color="text-emerald-700 bg-emerald-50 border-emerald-100" />
            <StatPill label="警告" value={stats.warning} color="text-amber-700 bg-amber-50 border-amber-100" />
            <StatPill label="错误" value={stats.error} color="text-red-700 bg-red-50 border-red-100" />
            <span className="border-l border-gray-200 mx-1" />
            <StatPill label="未签核" value={stats.unsigned} color="text-gray-600 bg-gray-50 border-gray-200" />
            <StatPill label="初始签核" value={stats.initialSigned} color="text-blue-700 bg-blue-50 border-blue-100" />
            <StatPill label="全量签核" value={stats.fullSigned} color="text-emerald-700 bg-emerald-50 border-emerald-100" />
            <span className="border-l border-gray-200 mx-1" />
            <StatPill label="图片缺失" value={stats.imageMissing} color="text-red-600 bg-red-50 border-red-100" />
            <StatPill label="编排未关联" value={stats.noArrangement} color="text-amber-600 bg-amber-50 border-amber-100" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2 flex gap-2 items-center border-b border-gray-100 bg-gray-50/50 text-[11px] overflow-x-auto no-scrollbar shrink-0">
          <MiniSelect label="类型" value={filterType} onChange={v => { setFilterType(v); setCurrentPage(1); }} options={["全部", "视频", "音频", "游戏", "有声书", "服务类"]} />
          <MiniSelect label="签核" value={filterSignoff} onChange={v => { setFilterSignoff(v); setCurrentPage(1); }} options={["全部", "未签核", "初始签核", "全量签核"]} />
          <MiniSelect label="异常" value={filterAnomaly} onChange={v => { setFilterAnomaly(v); setCurrentPage(1); }} options={["全部", "无异常", "存在警告", "存在错误"]} />

          <label className="flex items-center gap-1.5 ml-2 cursor-pointer select-none text-gray-600 hover:text-indigo-600">
            <input type="checkbox" checked={includeSubCategories} onChange={e => setIncludeSubCategories(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5" />
            包含子分类
          </label>

          <div className="flex-1 relative max-w-[240px] ml-auto">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
              placeholder="搜索标题/ID/唯一标识..."
              className="w-full pl-7 pr-3 py-1 border border-gray-300 rounded bg-white outline-none focus:border-indigo-500 text-[11px]" />
          </div>
        </div>

        {/* Batch action bar */}
        {selectedRows.size > 0 && (
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-200 flex items-center gap-3 text-[11px] shrink-0">
            <span className="text-indigo-700" style={{ fontWeight: 600 }}>已选 {selectedRows.size} 项</span>
            <button className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"><Move className="w-3 h-3" /> 移动分类</button>
            <button className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"><Trash2 className="w-3 h-3" /> 移除挂载</button>
            <button className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"><Shield className="w-3 h-3" /> 批量签核</button>
            <button className="px-2 py-0.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"><Download className="w-3 h-3" /> 导出</button>
            <button onClick={() => setSelectedRows(new Set())} className="ml-auto text-indigo-500 hover:text-indigo-700">取消</button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px] text-left whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase bg-gray-50 sticky top-0 z-[5] border-b border-gray-200">
              <tr>
                <th className="px-3 py-2.5 w-7"><input type="checkbox" checked={selectedRows.size === pagedRows.length && pagedRows.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-indigo-600 w-3.5 h-3.5" /></th>
                <th className="px-3 py-2.5 font-medium w-8">序</th>
                <th className="px-3 py-2.5 font-medium">内容标题 / 唯一标识</th>
                <th className="px-3 py-2.5 font-medium">类型</th>
                <th className="px-3 py-2.5 font-medium">时长</th>
                <th className="px-3 py-2.5 font-medium">编排</th>
                <th className="px-3 py-2.5 font-medium">预告</th>
                <th className="px-3 py-2.5 font-medium">图片</th>
                <th className="px-3 py-2.5 font-medium">字幕</th>
                <th className="px-3 py-2.5 font-medium">音轨</th>
                <th className="px-3 py-2.5 font-medium">签核</th>
                <th className="px-3 py-2.5 font-medium">版本</th>
                <th className="px-3 py-2.5 font-medium">异常</th>
                <th className="px-3 py-2.5 font-medium w-16">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pagedRows.map(row => (
                <tr key={row.id} className={`hover:bg-indigo-50/30 transition-colors group ${selectedRows.has(row.id) ? "bg-indigo-50/20" : ""}`}>
                  <td className="px-3 py-2.5"><input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => toggleRow(row.id)} className="rounded border-gray-300 text-indigo-600 w-3.5 h-3.5" /></td>
                  <td className="px-3 py-2.5 text-gray-400 font-mono">{row.sortOrder}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer" style={{ fontWeight: 600 }}>{row.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{row.uid}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200 w-max">{row.type}</span>
                      <span className="text-[10px] text-gray-400">{row.subType}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono">{row.duration}</td>
                  <td className="px-3 py-2.5">{row.arrangement ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}</td>
                  <td className="px-3 py-2.5">{row.trailer ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}</td>
                  <td className="px-3 py-2.5">
                    {row.imageStatus === "full" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                      row.imageStatus === "partial" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> :
                        <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{row.subtitleCount}</td>
                  <td className="px-3 py-2.5 text-gray-600">{row.audioTrackCount}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${row.signStatus === "全量签核" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : row.signStatus === "初始签核" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`} style={{ fontWeight: 500 }}>{row.signStatus}</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono">{row.version}</td>
                  <td className="px-3 py-2.5 relative">
                    {row.anomaly === "none" ? (
                      <span className="text-gray-300">—</span>
                    ) : (
                      <div className="relative" onMouseEnter={() => setHoveredAnomaly(row.id)} onMouseLeave={() => setHoveredAnomaly(null)}>
                        {row.anomaly === "error" ? <span className="text-red-500 cursor-help">⛔</span> : <span className="text-amber-500 cursor-help">⚠</span>}
                        {hoveredAnomaly === row.id && row.anomalyDetails.length > 0 && (
                          <div className="absolute right-0 top-6 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-[11px]">
                            <p className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>异常详情 ({row.anomalyDetails.length})</p>
                            {row.anomalyDetails.map((d, i) => (
                              <div key={i} className={`flex items-start gap-2 py-1.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                                {d.startsWith("ERR-0") && parseInt(d.substring(4, 7)) <= 2 ? <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />}
                                <span className="text-gray-700 whitespace-normal">{d}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="查看"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="编辑"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="更多"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-[11px] bg-white shrink-0">
          <span className="text-gray-500">共 {filteredRows.length} 条 {includeSubCategories ? "(含子分类)" : "(仅直接挂载)"}</span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-0.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30"><ChevronsLeft className="w-3.5 h-3.5" /></button>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-0.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-2 py-0.5 border rounded text-[10px] ${p === currentPage ? "border-indigo-600 text-white bg-indigo-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>{p}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-0.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5" /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="p-0.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-30"><ChevronsRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* ── Node Property Editor ── */}
      {showNodeEditor && (
        <NodePropertyEditor nodeInfo={nodeInfo} tab={nodeEditorTab} setTab={setNodeEditorTab} onClose={() => setShowNodeEditor(false)} />
      )}

      {/* ── Context Menu ── */}
      {contextMenu && (
        <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] text-[12px]" style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}>
          {[
            { icon: FolderPlus, label: "新增子分类", divider: false },
            { icon: Edit3, label: "编辑", divider: false },
            { icon: Copy, label: "复制", divider: false },
            { icon: Move, label: "移动到...", divider: true },
            { icon: ArrowUp, label: "上移", divider: false },
            { icon: ArrowDown, label: "下移", divider: true },
            { icon: Lock, label: "锁定/解锁", divider: false },
            { icon: Ban, label: "禁用/启用", divider: true },
            { icon: Eye, label: "查看属性", divider: false },
            { icon: Trash2, label: "删除", divider: false },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {item.divider && <div className="border-t border-gray-100 my-1" />}
              <button onClick={() => setContextMenu(null)} className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${item.label === "删除" ? "text-red-600 hover:bg-red-50 hover:text-red-700" : "text-gray-700"}`}>
                <item.icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Node Property Editor Panel ───
function NodePropertyEditor({ nodeInfo, tab, setTab, onClose }: {
  nodeInfo: TreeNodeData | null; tab: string; setTab: (t: any) => void; onClose: () => void;
}) {
  const tabs = [
    { id: "basic", label: "基础信息" },
    { id: "rules", label: "规则设置" },
    { id: "adapt", label: "适配属性" },
    { id: "lang", label: "多语言" },
    { id: "display", label: "展示资源" },
    { id: "log", label: "操作日志" },
  ];

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
      <div className="h-11 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <h3 className="text-xs text-gray-900" style={{ fontWeight: 600 }}>节点属性 - {nodeInfo?.title || ""}</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><XCircle className="w-4 h-4" /></button>
      </div>

      <div className="flex border-b border-gray-200 text-[10px] overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-2.5 py-2 border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            style={{ fontWeight: tab === t.id ? 600 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-[12px] space-y-4">
        {tab === "basic" && (
          <>
            <FormField label="分类名称" value={nodeInfo?.title || ""} />
            <FormField label="分类编码" value={nodeInfo?.code || ""} mono />
            <FormField label="导出编码" value={nodeInfo?.code || ""} mono />
            <FormField label="分类描述" value="用于组织和展示首页推荐内容" textarea />
            <FormField label="Media Config (Scope)" value="Global" select options={["Global", "Media Config 1 (Domestic)", "Media Config 2 (Intl)"]} />
            <FormField label="UI Type (cidtype)" value="standard" select options={[
              "top_menu", "bottom_menu", "burger_menu", 
              "movies", "tv", "music", "games", "info", 
              "welcome_video", "shopping", "connecting_gate", "game_videos",
              "kids", "kids_movies", "kids_tv", "kids_games", "kids_audio"
            ]} />
            <FormField label="分类用途" value="标准分类" select options={["标准分类", "运营分类", "导出分类", "展示分类"]} />
            <FormField label="排序位置" value="1" />
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button className="flex-1 py-1.5 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700" style={{ fontWeight: 500 }}>保存</button>
              <button className="flex-1 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50" style={{ fontWeight: 500 }}>取消</button>
            </div>
          </>
        )}

        {tab === "rules" && (
          <>
            <FormField label="允许内容类型" value="全部类型" select options={["全部类型", "仅视频", "仅音频", "视频+游戏"]} />
            <FormField label="锁定类型" value={nodeInfo?.locked === "full" ? "完全锁定" : nodeInfo?.locked === "partial" ? "部分锁定" : "未锁定"} select options={["未锁定", "部分锁定", "完全锁定"]} />
            <ToggleField label="隐藏空分类" checked={true} desc="当分类下无内容时，导出时隐藏此节点" />
            <ToggleField label="强制导出" checked={false} desc="即使无内容，也在导出中保留此节点" />
            <ToggleField label="已禁用" checked={nodeInfo?.disabled || false} desc="禁用后其下内容不参与导出" />
            <ToggleField label="虚拟分类" checked={nodeInfo?.virtual || false} desc="虚拟分类导出时合并到父分类" />
            <FormField label="最小内容数" value="0" />
            <FormField label="最大内容数" value="" placeholder="不限制" />
          </>
        )}

        {tab === "adapt" && (
          <div className="space-y-3">
            <p className="text-[11px] text-gray-500">适配属性控制该分类在不同维度下的生效范围。</p>
            {[
              { dim: "机型", mode: "包含", values: "B737, A320, C919" },
              { dim: "舱位", mode: "排除", values: "经济舱" },
              { dim: "区域", mode: "全量", values: "全部" },
            ].map((rule, i) => (
              <div key={i} className="p-2.5 border border-gray-200 rounded-lg bg-gray-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-700" style={{ fontWeight: 500 }}>{rule.dim}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${rule.mode === "包含" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : rule.mode === "排除" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>{rule.mode}</span>
                </div>
                <p className="text-[11px] text-gray-500">{rule.values}</p>
              </div>
            ))}
            <button className="w-full py-1.5 text-xs text-indigo-600 border border-dashed border-indigo-300 rounded hover:bg-indigo-50 flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> 添加适配维度
            </button>
          </div>
        )}

        {tab === "lang" && (
          <div className="space-y-3">
            {[
              { lang: "简体中文 (zh-CN)", value: "首页推荐", primary: true },
              { lang: "English (en)", value: "Home Recommendations", primary: false },
              { lang: "日本語 (ja)", value: "おすすめ", primary: false },
            ].map((item, i) => (
              <div key={i} className="p-2.5 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700" style={{ fontWeight: 500 }}>{item.lang}</span>
                  {item.primary && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded">主语言</span>}
                </div>
                <input className="w-full px-2 py-1 border border-gray-200 rounded bg-white text-[11px] outline-none focus:border-indigo-500" defaultValue={item.value} />
              </div>
            ))}
            <button className="w-full py-1.5 text-xs text-indigo-600 border border-dashed border-indigo-300 rounded hover:bg-indigo-50 flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> 添加语言
            </button>
          </div>
        )}

        {tab === "display" && (
          <div className="space-y-3">
            <p className="text-[11px] text-gray-500">分类图标/图片</p>
            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-[11px]">点击或拖拽上传图标</span>
            </div>
            <p className="text-[10px] text-gray-400">支持 PNG/JPG，建议尺寸 400×200px，最大 1MB</p>
          </div>
        )}

        {tab === "log" && (
          <div className="space-y-3">
            {[
              { action: "修改锁定类型: 未锁定 → 部分锁定", time: "2026-03-28 14:30", user: "Admin" },
              { action: "新增子分类「编辑推荐」", time: "2026-03-25 10:00", user: "Content Ops" },
              { action: "调整排序位置: 3 → 1", time: "2026-03-20 16:45", user: "Admin" },
              { action: "编辑分类名称: 推荐 → 首页推荐", time: "2026-03-15 09:20", user: "Admin" },
              { action: "创建分类节点", time: "2026-03-01 08:00", user: "System" },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] text-gray-700">{log.action}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{log.user} · {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tree Node Component ───
function TreeNodeComp({ node, selectedId, onSelect, onContextMenu, search, defaultExpanded = [] }: {
  node: TreeNodeData; selectedId: string; onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  search: string; defaultExpanded?: string[];
}) {
  const [isOpen, setIsOpen] = useState(defaultExpanded.includes(node.id));
  const hasChildren = !!node.children?.length;
  const isActive = selectedId === node.id;
  const matchesSearch = search && node.title.toLowerCase().includes(search.toLowerCase());

  const statusDot = node.status === "error" ? "bg-red-400" : node.status === "warning" ? "bg-amber-400" : node.status === "normal" ? "bg-emerald-400" : "";

  return (
    <div>
      <div
        className={`flex items-center justify-between px-1.5 py-1 rounded cursor-pointer transition-colors group ${isActive ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"} ${node.disabled ? "opacity-50" : ""} ${node.virtual ? "border border-dashed border-gray-300" : ""}`}
        onClick={() => onSelect(node.id)}
        onContextMenu={e => onContextMenu(e, node.id)}>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {hasChildren ? (
            <button onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 hover:bg-gray-200 rounded text-gray-400 shrink-0">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : <span className="w-4 shrink-0" />}
          {statusDot && <span className={`w-1.5 h-1.5 rounded-full ${statusDot} shrink-0`} />}
          {node.locked === "full" && <Lock className="w-2.5 h-2.5 text-red-400 shrink-0" />}
          {node.locked === "partial" && <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
          <span className={`truncate flex-1 ${matchesSearch ? "bg-yellow-100 text-yellow-800 px-0.5 rounded" : ""}`}
            style={{ fontWeight: isActive ? 600 : 400 }} title={node.title}>{node.title}</span>
          {node.hasAdaptation && <span className="text-[8px] px-1 py-0 bg-purple-50 text-purple-500 border border-purple-200 rounded shrink-0">适</span>}
        </div>
        {(node.count !== undefined || node.totalCount !== undefined) && (
          <span className={`text-[9px] px-1 py-0.5 rounded-full shrink-0 ml-1 ${isActive ? "bg-indigo-200 text-indigo-800" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"}`} style={{ fontWeight: 500 }}>
            {node.count !== undefined && node.totalCount !== undefined && node.count !== node.totalCount ? `${node.count}/${node.totalCount}` : node.count || node.totalCount}
          </span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="pl-3 ml-2 border-l border-gray-200 mt-0.5 space-y-0.5">
          {node.children!.map(child => (
            <TreeNodeComp key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onContextMenu={onContextMenu} search={search} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared Components ───
function StatPill({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${color || "text-gray-700 bg-gray-50 border-gray-200"}`}>
      {label}: <span style={{ fontWeight: 600 }}>{value}</span>
      {sub && <span className="text-gray-400">({sub})</span>}
    </span>
  );
}

function MiniSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-500 whitespace-nowrap">{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="border border-gray-300 rounded px-1.5 py-0.5 bg-white outline-none min-w-[60px] focus:border-indigo-500 text-[11px]">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FormField({ label, value, mono, textarea, select, options, placeholder }: {
  label: string; value: string; mono?: boolean; textarea?: boolean; select?: boolean; options?: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
      {select ? (
        <select defaultValue={value} className="w-full px-2 py-1.5 border border-gray-200 rounded bg-white text-[11px] outline-none focus:border-indigo-500">
          {options?.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : textarea ? (
        <textarea defaultValue={value} className="w-full px-2 py-1.5 border border-gray-200 rounded bg-white text-[11px] outline-none focus:border-indigo-500 h-16 resize-none" />
      ) : (
        <input defaultValue={value} placeholder={placeholder} className={`w-full px-2 py-1.5 border border-gray-200 rounded bg-white text-[11px] outline-none focus:border-indigo-500 ${mono ? "font-mono" : ""}`} />
      )}
    </div>
  );
}

function ToggleField({ label, checked, desc }: { label: string; checked: boolean; desc: string }) {
  const [on, setOn] = useState(checked);
  return (
    <div className="flex items-start gap-3 py-2">
      <button onClick={() => setOn(!on)} className={`w-8 h-4.5 rounded-full transition-colors shrink-0 mt-0.5 ${on ? "bg-indigo-600" : "bg-gray-300"}`}>
        <div className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
      <div>
        <p className="text-[11px] text-gray-900" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─── Helpers ───
function findNode(nodes: TreeNodeData[], id: string): TreeNodeData | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) { const found = findNode(n.children, id); if (found) return found; }
  }
  return null;
}

function findNodePath(nodes: TreeNodeData[], id: string, path: { id: string; title: string }[] = []): { id: string; title: string }[] {
  for (const n of nodes) {
    const currentPath = [...path, { id: n.id, title: n.title }];
    if (n.id === id) return currentPath;
    if (n.children) { const found = findNodePath(n.children, id, currentPath); if (found.length) return found; }
  }
  return [];
}
