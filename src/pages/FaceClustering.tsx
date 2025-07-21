import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  List,
  Drawer,
  Switch,
  Radio,
  Tabs,
  Progress,
  notification,
  Flex,
  Dropdown,
  MenuProps,
  Image,
  Descriptions,
  Timeline,
  Alert,
  Upload,
  Slider,
  InputNumber
} from 'antd';
import {
  ClusterOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  FullscreenOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
  SecurityScanOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  SearchOutlined,
  UploadOutlined,
  PictureOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { Line, Pie, Column, Scatter, Heatmap } from '@ant-design/plots';
import { faceData, FaceData } from '../data/faceData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface FaceCluster {
  id: string;
  name: string;
  faceCount: number;
  similarity: number;
  firstSeen: string;
  lastSeen: string;
  locations: string[];
  frequency: number;
  status: 'active' | 'inactive' | 'suspicious';
  description: string;
  representativeImage: string;
  confidence: number;
}

interface FaceRecord {
  id: string;
  clusterId: string;
  imageUrl: string;
  location: string;
  timestamp: string;
  confidence: number;
  similarity: number;
  age?: number;
  gender?: 'male' | 'female';
  emotion?: string;
  quality: number;
  extractedFeatures: number[];
}

interface ClusteringStatistics {
  totalClusters: number;
  totalFaces: number;
  activeClusters: number;
  suspiciousClusters: number;
  averageSimilarity: number;
  byLocation: { location: string; count: number }[];
  byTime: { time: string; count: number }[];
  byConfidence: { confidence: string; count: number }[];
}

const FaceClustering: React.FC = () => {
  const [faceClusters, setFaceClusters] = useState<FaceCluster[]>([]);
  const [faceRecords, setFaceRecords] = useState<FaceRecord[]>([]);
  const [statistics, setStatistics] = useState<ClusteringStatistics>({
    totalClusters: 0,
    totalFaces: 0,
    activeClusters: 0,
    suspiciousClusters: 0,
    averageSimilarity: 0,
    byLocation: [],
    byTime: [],
    byConfidence: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<FaceCluster | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<FaceRecord | null>(null);
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('clusters');
  const [similarityThreshold, setSimilarityThreshold] = useState(85);
  const [form] = Form.useForm();

  // 基于真实人脸数据生成聚类数据
  const mockFaceClusters: FaceCluster[] = [
    {
      id: 'FC001',
      name: '聚类组-001',
      faceCount: 3,
      similarity: 94.2, // 基于该组人脸的平均置信度
      firstSeen: '2024-01-15 14:12:05',
      lastSeen: '2024-01-15 14:30:25',
      locations: ['市政府大楼入口', '停车场A区', '办公楼大厅'],
      frequency: 3,
      status: 'active',
      description: '频繁出现在政府大楼区域的人员',
      representativeImage: faceData[0].image,
      confidence: 94.2
    },
    {
      id: 'FC002',
      name: '聚类组-002',
      faceCount: 2,
      similarity: 87.3, // 基于该组人脸的平均置信度
      firstSeen: '2024-01-15 14:15:20',
      lastSeen: '2024-01-15 14:25:45',
      locations: ['档案室门口', '办公楼大厅'],
      frequency: 2,
      status: 'suspicious',
      description: '可疑人员，多次出现在敏感区域',
      representativeImage: faceData[2].image,
      confidence: 87.8
    },
    {
      id: 'FC003',
      name: '聚类组-003',
      faceCount: 2,
      similarity: 96.8, // 基于该组人脸的平均置信度
      firstSeen: '2024-01-15 14:18:50',
      lastSeen: '2024-01-15 14:22:30',
      locations: ['电梯间', '会议室走廊'],
      frequency: 2,
      status: 'active',
      description: '正常工作人员，在办公区域活动',
      representativeImage: faceData[3].image,
      confidence: 96.5
    },
    {
      id: 'FC004',
      name: '聚类组-004',
      faceCount: 1,
      similarity: 45.6, // 基于该组人脸的平均置信度
      firstSeen: '2024-01-15 14:20:15',
      lastSeen: '2024-01-15 14:20:15',
      locations: ['后门区域'],
      frequency: 1,
      status: 'inactive',
      description: '未知人员，需要进一步确认身份',
      representativeImage: faceData[4].image,
      confidence: 89.1
    },
    {
      id: 'FC005',
      name: '聚类组-005',
      faceCount: 2,
      similarity: 89.4, // 基于该组人脸的平均置信度
      firstSeen: '2024-01-15 14:15:20',
      lastSeen: '2024-01-15 14:12:05',
      locations: ['档案室门口', '食堂入口'],
      frequency: 2,
      status: 'active',
      description: '工作人员，在办公区域正常活动',
      representativeImage: faceData[6].image,
      confidence: 95.7
    }
  ];

  // 基于真实人脸数据生成记录数据
  const mockFaceRecords: FaceRecord[] = faceData.map((face, index) => {
    // 根据置信度计算合理的相似度
    const baseSimilarity = face.confidence * 0.9; // 相似度通常略低于置信度
    const similarityVariation = (Math.random() - 0.5) * 10; // ±5的随机变化
    const similarity = Math.max(60, Math.min(100, baseSimilarity + similarityVariation));
    
    // 根据置信度和图片质量计算质量分数
    const baseQuality = face.confidence * 0.85; // 质量分数通常低于置信度
    const qualityVariation = (Math.random() - 0.5) * 15; // ±7.5的随机变化
    const quality = Math.max(50, Math.min(100, baseQuality + qualityVariation));
    
    // 使用真实人脸数据中的年龄和性别
    const age = face.age;
    const gender = face.gender;
    
    // 根据置信度和状态推断情绪
    let emotion = 'neutral';
    if (face.status === 'suspicious') {
      emotion = Math.random() > 0.5 ? 'suspicious' : 'angry';
    } else if (face.confidence > 95) {
      emotion = Math.random() > 0.7 ? 'happy' : 'neutral';
    } else if (face.confidence < 70) {
      emotion = Math.random() > 0.5 ? 'sad' : 'neutral';
    }
    
    return {
      id: `FR${String(index + 1).padStart(3, '0')}`,
      clusterId: `FC${String(Math.floor(index / 2) + 1).padStart(3, '0')}`,
      imageUrl: face.image,
      location: face.location,
      timestamp: face.timestamp,
      confidence: face.confidence,
      similarity: Math.round(similarity * 10) / 10, // 保留一位小数
      age: age,
      gender: gender,
      emotion: emotion,
      quality: Math.round(quality * 10) / 10, // 保留一位小数
      extractedFeatures: Array.from({ length: 5 }, () => Math.random())
    };
  });

  // 基于真实人脸数据生成统计数据
  const mockStatistics: ClusteringStatistics = {
    totalClusters: 5,
    totalFaces: faceData.length,
    activeClusters: 4,
    suspiciousClusters: 2,
    averageSimilarity: Math.round((94.2 + 87.3 + 96.8 + 45.6 + 89.4) / 5 * 10) / 10, // 计算真实平均相似度
    byLocation: [
      { location: '市政府大楼入口', count: 1 },
      { location: '停车场A区', count: 1 },
      { location: '办公楼大厅', count: 2 },
      { location: '会议室走廊', count: 1 },
      { location: '后门区域', count: 1 },
      { location: '电梯间', count: 1 },
      { location: '档案室门口', count: 1 },
      { location: '食堂入口', count: 1 }
    ],
    byTime: [
      { time: '14:12', count: 1 },
      { time: '14:15', count: 1 },
      { time: '14:18', count: 1 },
      { time: '14:20', count: 2 },
      { time: '14:22', count: 1 },
      { time: '14:25', count: 1 },
      { time: '14:28', count: 1 },
      { time: '14:30', count: 1 }
    ],
    byConfidence: [
      { confidence: '90-100%', count: 4 },
      { confidence: '80-90%', count: 3 },
      { confidence: '70-80%', count: 1 },
      { confidence: '40-50%', count: 1 }
    ]
  };

  useEffect(() => {
    setFaceClusters(mockFaceClusters);
    setFaceRecords(mockFaceRecords);
    setStatistics(mockStatistics);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'suspicious': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'suspicious': return '可疑';
      default: return '未知';
    }
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '男' : '女';
  };

  const getEmotionText = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '开心';
      case 'sad': return '悲伤';
      case 'angry': return '愤怒';
      case 'suspicious': return '可疑';
      case 'neutral': return '平静';
      default: return '未知';
    }
  };

  const clusterColumns = [
    {
      title: '聚类名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: FaceCluster) => (
        <Space>
          <Avatar src={record.representativeImage} size="small" />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '人脸数量',
      dataIndex: 'faceCount',
      key: 'faceCount',
      width: 100,
      render: (count: number) => (
        <Tag color="blue">{count} 张</Tag>
      ),
    },
    {
      title: '相似度',
      dataIndex: 'similarity',
      key: 'similarity',
      width: 100,
      render: (similarity: number) => (
        <Progress 
          percent={similarity} 
          size="small" 
          status={similarity > 90 ? 'success' : similarity > 80 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'processing'} 
          text={getStatusText(status)} 
        />
      ),
    },
    {
      title: '出现频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (frequency: number) => (
        <Tag color={frequency > 10 ? 'red' : frequency > 5 ? 'orange' : 'green'}>
          {frequency} 次
        </Tag>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 100,
      render: (confidence: number) => (
        <Progress 
          percent={confidence} 
          size="small" 
          status={confidence > 90 ? 'success' : confidence > 80 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '最后出现',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: FaceCluster) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewCluster(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<SearchOutlined />}
            onClick={() => handleSearchSimilar(record)}
          >
            搜索
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditCluster(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    {
      title: '人脸图片',
      key: 'image',
      width: 100,
      render: (_: any, record: FaceRecord) => (
        <Image 
          src={record.imageUrl} 
          alt="人脸图片" 
          width={60} 
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '聚类组',
      dataIndex: 'clusterId',
      key: 'clusterId',
      width: 120,
      render: (clusterId: string) => {
        const cluster = faceClusters.find(c => c.id === clusterId);
        return cluster ? cluster.name : clusterId;
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '相似度',
      dataIndex: 'similarity',
      key: 'similarity',
      width: 100,
      render: (similarity: number) => (
        <Progress 
          percent={similarity} 
          size="small" 
          status={similarity > 90 ? 'success' : similarity > 80 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '年龄/性别',
      key: 'demographics',
      width: 100,
      render: (_: any, record: FaceRecord) => (
        <Space direction="vertical" size="small">
          <Text>{record.age || '未知'}岁</Text>
          <Text>{record.gender ? getGenderText(record.gender) : '未知'}</Text>
        </Space>
      ),
    },
    {
      title: '情绪',
      dataIndex: 'emotion',
      key: 'emotion',
      width: 100,
      render: (emotion: string) => (
        <Tag color="purple">{getEmotionText(emotion)}</Tag>
      ),
    },
    {
      title: '质量',
      dataIndex: 'quality',
      key: 'quality',
      width: 100,
      render: (quality: number) => (
        <Progress 
          percent={quality} 
          size="small" 
          status={quality > 80 ? 'success' : quality > 60 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: FaceRecord) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewRecord(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  const handleViewCluster = (cluster: FaceCluster) => {
    setSelectedCluster(cluster);
    setShowClusterModal(true);
  };

  const handleSearchSimilar = (cluster: FaceCluster) => {
    notification.info({
      message: '搜索相似人脸',
      description: `正在搜索与 ${cluster.name} 相似的人脸`,
    });
  };

  const handleEditCluster = (cluster: FaceCluster) => {
    setSelectedCluster(cluster);
    form.setFieldsValue(cluster);
    // 这里可以打开编辑模态框
  };

  const handleViewRecord = (record: FaceRecord) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleSimilarityChange = (value: number | null) => {
    if (value !== null) {
      setSimilarityThreshold(value);
      notification.info({
        message: '相似度阈值已更新',
        description: `当前阈值: ${value}%`,
      });
    }
  };

  const locationChartData = statistics.byLocation.map(item => ({
    location: item.location,
    count: item.count,
  }));

  const timeChartData = statistics.byTime.map(item => ({
    time: item.time,
    count: item.count,
  }));

  const confidenceChartData = statistics.byConfidence.map(item => ({
    confidence: item.confidence,
    count: item.count,
  }));

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 600 }}>
              <ClusterOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              智能人像聚类分析平台
            </h2>
            <p style={{ margin: '8px 0 0 40px', color: '#666', fontSize: 16 }}>
              基于深度学习的多模态人脸特征提取与智能聚类系统 - FaceNet + DBSCAN
            </p>
          </div>
          <Space>
            <Button 
              icon={soundEnabled ? <SoundOutlined /> : <AudioMutedOutlined />}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? '关闭声音' : '开启声音'}
            />
            <Button 
              icon={autoRefresh ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? '暂停自动刷新' : '开启自动刷新'}
            />
            <Button 
              icon={<FilterOutlined />}
            >
              筛选
            </Button>
            <Button 
              icon={<ExportOutlined />}
            >
              导出
            </Button>
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              onClick={handleUpload}
            >
              上传图片
            </Button>
          </Space>
        </div>
      </div>

      {/* 算法配置面板 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>特征提取算法</Text>
              <Select 
                defaultValue="facenet" 
                style={{ width: '100%', marginTop: 8 }}
                placeholder="选择算法"
              >
                <Option value="facenet">FaceNet (Google)</Option>
                <Option value="arcface">ArcFace (InsightFace)</Option>
                <Option value="deepface">DeepFace (Facebook)</Option>
                <Option value="sphereface">SphereFace</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>聚类算法</Text>
              <Select 
                defaultValue="dbscan" 
                style={{ width: '100%', marginTop: 8 }}
                placeholder="选择聚类方法"
              >
                <Option value="dbscan">DBSCAN (密度聚类)</Option>
                <Option value="kmeans">K-Means (质心聚类)</Option>
                <Option value="spectral">Spectral (谱聚类)</Option>
                <Option value="agglomerative">Agglomerative (层次聚类)</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>相似度阈值: {similarityThreshold}%</Text>
              <Slider
                min={50}
                max={95}
                value={similarityThreshold}
                onChange={setSimilarityThreshold}
                style={{ marginTop: 8 }}
                marks={{
                  50: '50%',
                  70: '70%',
                  85: '85%',
                  95: '95%'
                }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>处理状态</Text>
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={85} 
                  status="active"
                  format={() => '处理中 85%'}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  GPU加速 | 批处理: 32 | 特征维度: 512
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="智能聚类组"
              value={statistics.totalClusters}
              prefix={<ClusterOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={Math.round((statistics.totalClusters / 50) * 100)} 
              size="small" 
              strokeColor="#1890ff"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              准确率: 94.2% | 算法: DBSCAN
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="特征向量数"
              value={statistics.totalFaces}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((statistics.totalFaces / 3000) * 100)} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              维度: 512D | 提取率: 98.5%
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="活跃身份"
              value={statistics.activeClusters}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress 
              percent={Math.round((statistics.activeClusters / (statistics.totalClusters || 1)) * 100)} 
              size="small" 
              strokeColor="#722ed1"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              置信度: {'>'}85% | 频次: 高
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="相似度分析"
              value={statistics.averageSimilarity}
              suffix="%"
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Progress 
              percent={statistics.averageSimilarity} 
              size="small" 
              strokeColor="#fa8c16"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              余弦距离 | 阈值: {similarityThreshold}%
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 相似度阈值设置 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Text strong>相似度阈值:</Text>
          </Col>
          <Col span={12}>
            <Slider
              min={60}
              max={100}
              value={similarityThreshold}
              onChange={handleSimilarityChange}
              marks={{
                60: '60%',
                70: '70%',
                80: '80%',
                90: '90%',
                100: '100%'
              }}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={60}
              max={100}
              value={similarityThreshold}
              onChange={handleSimilarityChange}
              suffix="%"
            />
          </Col>
          <Col span={4}>
            <Text type="secondary">
              当前阈值: {similarityThreshold}%
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card title="聚类位置分布" size="small">
            <Column
              data={locationChartData}
              xField="location"
              yField="count"
              label={{
                position: 'top',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.6,
                },
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="识别时间分布" size="small">
            <Line
              data={timeChartData}
              xField="time"
              yField="count"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="置信度分布" size="small">
            <Pie
              data={confidenceChartData}
              angleField="count"
              colorField="confidence"
              radius={0.8}
              label={{
                content: (item: any) => `${item.name} ${item.percentage}`,
              }}

            />
          </Card>
        </Col>
      </Row>

      {/* 标签页内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="聚类管理" key="clusters">
            <div style={{ marginBottom: '16px' }}>
              <Text>共 {faceClusters.length} 个聚类组</Text>
            </div>
            <Table
              columns={clusterColumns}
              dataSource={faceClusters}
              rowKey="id"
              loading={loading}
              pagination={{
                total: faceClusters.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          
          <TabPane tab="特征分析" key="features">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="特征提取统计" size="small" style={{ marginBottom: 16 }}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 'bold' }}>特征向量分布热力图</div>
                    <div style={{ 
                      height: 150, 
                      background: 'linear-gradient(45deg, #1890ff 0%, #52c41a 25%, #faad14 50%, #ff4d4f 75%, #722ed1 100%)', 
                      borderRadius: 8, 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#fff', textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>512D</div>
                        <div style={{ fontSize: 12 }}>特征维度</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>特征提取成功率</span>
                        <span>98.5%</span>
                      </div>
                      <Progress percent={98.5} size="small" strokeColor="#52c41a" />
                    </div>
                  </div>
                </Card>
                
                <Card title="算法性能" size="small">
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>FaceNet</Text>
                        <Text>94%</Text>
                      </div>
                      <Progress percent={94} size="small" strokeColor="#1890ff" />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>ArcFace</Text>
                        <Text>91%</Text>
                      </div>
                      <Progress percent={91} size="small" strokeColor="#52c41a" />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>DeepFace</Text>
                        <Text>88%</Text>
                      </div>
                      <Progress percent={88} size="small" strokeColor="#faad14" />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="相似度矩阵" size="small" style={{ marginBottom: 16 }}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, marginBottom: 16 }}>
                      {Array.from({ length: 36 }, (_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: `rgba(24, 144, 255, ${Math.random() * 0.8 + 0.2})`,
                            borderRadius: 2
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                      余弦相似度矩阵 (6x6 样本)
                    </div>
                  </div>
                </Card>
                
                <Card title="聚类质量评估" size="small">
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>A+</div>
                      <div style={{ color: '#666', fontSize: 12 }}>聚类质量等级</div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12 }}>轮廓系数</span>
                        <span style={{ fontSize: 12 }}>0.82</span>
                      </div>
                      <Progress percent={82} size="small" strokeColor="#1890ff" />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12 }}>Calinski-Harabasz</span>
                        <span style={{ fontSize: 12 }}>458.3</span>
                      </div>
                      <Progress percent={85} size="small" strokeColor="#52c41a" />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="实时处理状态" size="small" style={{ marginBottom: 16 }}>
                  <Timeline>
                    <Timeline.Item color="green">
                      <Text strong style={{ fontSize: 12 }}>特征提取完成</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>14:30:15 - 处理 156 张人脸</Text>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <Text strong style={{ fontSize: 12 }}>DBSCAN聚类运行</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>14:29:45 - 密度聚类算法</Text>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <Text strong style={{ fontSize: 12 }}>相似度计算</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>14:29:20 - 余弦距离矩阵</Text>
                    </Timeline.Item>
                    <Timeline.Item>
                      <Text strong style={{ fontSize: 12 }}>数据预处理</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>14:29:00 - 对齐与归一化</Text>
                    </Timeline.Item>
                  </Timeline>
                </Card>
                
                <Card title="系统参数" size="small">
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="GPU型号">Tesla V100</Descriptions.Item>
                    <Descriptions.Item label="批处理大小">32</Descriptions.Item>
                    <Descriptions.Item label="学习率">0.001</Descriptions.Item>
                    <Descriptions.Item label="优化器">Adam</Descriptions.Item>
                    <Descriptions.Item label="处理速度">50ms/张</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="人脸记录" key="records">
            <div style={{ marginBottom: '16px' }}>
              <Text>共 {faceRecords.length} 条记录</Text>
            </div>
            <Table
              columns={recordColumns}
              dataSource={faceRecords}
              rowKey="id"
              loading={loading}
              pagination={{
                total: faceRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 聚类详情模态框 */}
      <Modal
        title="聚类详情"
        open={showClusterModal}
        onCancel={() => setShowClusterModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowClusterModal(false)}>
            关闭
          </Button>,
          <Button key="search" type="primary" onClick={() => selectedCluster && handleSearchSimilar(selectedCluster)}>
            搜索相似
          </Button>,
        ]}
        width={800}
      >
        {selectedCluster && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="聚类名称">{selectedCluster.name}</Descriptions.Item>
                  <Descriptions.Item label="人脸数量">{selectedCluster.faceCount} 张</Descriptions.Item>
                  <Descriptions.Item label="相似度">{selectedCluster.similarity}%</Descriptions.Item>
                  <Descriptions.Item label="置信度">{selectedCluster.confidence}%</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge 
                      status={selectedCluster.status === 'active' ? 'success' : selectedCluster.status === 'inactive' ? 'error' : 'processing'} 
                      text={getStatusText(selectedCluster.status)} 
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="出现频率">{selectedCluster.frequency} 次</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="首次出现">{selectedCluster.firstSeen}</Descriptions.Item>
                  <Descriptions.Item label="最后出现">{selectedCluster.lastSeen}</Descriptions.Item>
                  <Descriptions.Item label="出现位置">
                    {selectedCluster.locations.join(', ')}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>描述:</strong></p>
            <p>{selectedCluster.description}</p>
            <Divider />
            <p><strong>代表图片:</strong></p>
            <Image src={selectedCluster.representativeImage} alt="代表图片" width={200} />
          </div>
        )}
      </Modal>

      {/* 人脸记录详情模态框 */}
      <Modal
        title="人脸记录详情"
        open={showRecordModal}
        onCancel={() => setShowRecordModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowRecordModal(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="记录ID">{selectedRecord.id}</Descriptions.Item>
                  <Descriptions.Item label="聚类组">{selectedRecord.clusterId}</Descriptions.Item>
                  <Descriptions.Item label="位置">{selectedRecord.location}</Descriptions.Item>
                  <Descriptions.Item label="时间">{selectedRecord.timestamp}</Descriptions.Item>
                  <Descriptions.Item label="相似度">{selectedRecord.similarity}%</Descriptions.Item>
                  <Descriptions.Item label="置信度">{selectedRecord.confidence}%</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1}>
                  <Descriptions.Item label="年龄">{selectedRecord.age || '未知'} 岁</Descriptions.Item>
                  <Descriptions.Item label="性别">{selectedRecord.gender ? getGenderText(selectedRecord.gender) : '未知'}</Descriptions.Item>
                  <Descriptions.Item label="情绪">
                    <Tag color="purple">{getEmotionText(selectedRecord.emotion || '')}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="图片质量">{selectedRecord.quality}%</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <p><strong>人脸图片:</strong></p>
            <Image src={selectedRecord.imageUrl} alt="人脸图片" width={300} />
          </div>
        )}
      </Modal>

      {/* 上传图片模态框 */}
      <Modal
        title="上传图片进行人脸识别"
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowUploadModal(false)}>
            取消
          </Button>,
          <Button key="upload" type="primary">
            开始识别
          </Button>,
        ]}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            accept="image/*"
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <FileImageOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，严禁上传公司数据或其他敏感文件
            </p>
          </Upload.Dragger>
        </div>
      </Modal>
    </div>
  );
};

export default FaceClustering; 