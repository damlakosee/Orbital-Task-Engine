import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Settings, Monitor, Clock, CheckCircle, XCircle, 
  AlertCircle, Loader, Moon, Sun, Plus, Download, Users, 
  Database, Shield, Activity, Server, Cpu, MemoryStick, 
  LogOut, User, Bell, TrendingUp, Brain, Zap, DollarSign,
  Target, BarChart3, GitBranch, Sparkles, Bot
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell 
} from 'recharts';

// =============================================================================
// CORE ENGINE - Simplified and Working
// =============================================================================

class TaskExecutionEngine {
  constructor() {
    this.executions = new Map();
    this.subscribers = new Set();
    this.metrics = {
      totalExecutions: 0,
      successRate: 85,
      avgExecutionTime: 2.5,
      activeWorkers: 3,
      queueDepth: 5
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  async executeDAG(dag) {
    const executionId = Date.now().toString();
    const execution = {
      id: executionId,
      dag: dag.id,
      status: 'running',
      startTime: new Date(),
      tasks: {},
      cost: Math.random() * 50 + 25
    };

    this.executions.set(executionId, execution);
    this.notify({ type: 'execution_started', execution });

    try {
      // Execute tasks sequentially for simplicity
      for (const task of dag.tasks) {
        const taskExecution = {
          id: task.id,
          status: 'running',
          startTime: new Date(),
          retries: 0
        };
        
        execution.tasks[task.id] = taskExecution;
        this.notify({ type: 'task_started', execution, task: taskExecution });

        // Simulate task execution
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Random success/failure
        if (Math.random() > 0.15) { // 85% success rate
          taskExecution.status = 'completed';
          taskExecution.endTime = new Date();
        } else {
          taskExecution.status = 'failed';
          taskExecution.endTime = new Date();
          taskExecution.error = 'Task execution failed';
          throw new Error('Task failed');
        }
        
        this.notify({ type: 'task_completed', execution, task: taskExecution });
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      this.updateMetrics(true);
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.endTime = new Date();
      this.updateMetrics(false);
    }

    this.notify({ type: 'execution_completed', execution });
    return execution;
  }

  updateMetrics(success) {
    this.metrics.totalExecutions++;
    if (success) {
      this.metrics.successRate = Math.min(95, this.metrics.successRate + 0.5);
    } else {
      this.metrics.successRate = Math.max(70, this.metrics.successRate - 1);
    }
    this.metrics.queueDepth = Math.max(0, this.metrics.queueDepth - 1);
  }
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const SAMPLE_DAGS = {
  data_pipeline: {
    id: 'data_pipeline',
    name: 'Data Processing Pipeline',
    description: 'ETL pipeline for customer data',
    version: '1.2.0',
    tasks: [
      { id: 'extract', name: 'Extract', type: 'extract', retries: 2 },
      { id: 'validate', name: 'Validate', type: 'validation', retries: 1 },
      { id: 'transform', name: 'Transform', type: 'transformation', retries: 3 },
      { id: 'load', name: 'Load', type: 'load', retries: 2 }
    ],
    dependencies: {
      validate: ['extract'],
      transform: ['validate'],
      load: ['transform']
    }
  },
  ml_pipeline: {
    id: 'ml_pipeline',
    name: 'ML Training Pipeline',
    description: 'Machine learning model training',
    version: '2.1.0',
    tasks: [
      { id: 'data_prep', name: 'Data Prep', type: 'preprocessing', retries: 2 },
      { id: 'train_model', name: 'Train Model', type: 'training', retries: 1 },
      { id: 'validate_model', name: 'Validate', type: 'validation', retries: 2 },
      { id: 'deploy_model', name: 'Deploy', type: 'deployment', retries: 3 }
    ],
    dependencies: {
      train_model: ['data_prep'],
      validate_model: ['train_model'],
      deploy_model: ['validate_model']
    }
  }
};

// =============================================================================
// UI COMPONENTS
// =============================================================================

// Authentication Component
const AuthModal = ({ onLogin, isOpen }) => {
  const [email, setEmail] = useState('admin@orbital.dev');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onLogin({
        id: 1,
        email,
        role: 'admin',
        permissions: ['dag:read', 'dag:write', 'dag:execute']
      });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to Orbital</h2>
          <p className="text-gray-600 mt-2">Distributed Task Orchestration Platform</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Demo Credentials: admin@orbital.dev / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

// Task Status Badge
const TaskStatusBadge = ({ status }) => {
  const configs = {
    pending: { icon: Clock, color: 'bg-gray-500', text: 'Pending' },
    running: { icon: Loader, color: 'bg-blue-500', text: 'Running' },
    completed: { icon: CheckCircle, color: 'bg-green-500', text: 'Completed' },
    failed: { icon: XCircle, color: 'bg-red-500', text: 'Failed' }
  };
  
  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
      <Icon className={`w-3 h-3 mr-1 ${status === 'running' ? 'animate-spin' : ''}`} />
      {config.text}
    </span>
  );
};

// DAG Visualizer
const DAGVisualizer = ({ dag, execution }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!dag || !svgRef.current) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 300;
    
    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Simple horizontal layout
    const taskWidth = width / (dag.tasks.length + 1);
    
    // Draw connections
    dag.tasks.forEach((task, index) => {
      if (index > 0) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', taskWidth * index);
        line.setAttribute('y1', height / 2);
        line.setAttribute('x2', taskWidth * (index + 1));
        line.setAttribute('y2', height / 2);
        line.setAttribute('stroke', '#4b5563');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    });

    // Draw task nodes
    dag.tasks.forEach((task, index) => {
      const taskStatus = execution?.tasks?.[task.id]?.status || 'pending';
      const x = taskWidth * (index + 1);
      const y = height / 2;
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '30');
      
      let fillColor = '#e5e7eb'; // pending
      if (taskStatus === 'running') fillColor = '#3b82f6';
      else if (taskStatus === 'completed') fillColor = '#10b981';
      else if (taskStatus === 'failed') fillColor = '#ef4444';
      
      circle.setAttribute('fill', fillColor);
      circle.setAttribute('stroke', '#374151');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
      
      // Task label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.textContent = task.name.substring(0, 8);
      svg.appendChild(text);
      
      // Task name below
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', x);
      nameText.setAttribute('y', y + 50);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('fill', '#374151');
      nameText.setAttribute('font-size', '10');
      nameText.textContent = task.name;
      svg.appendChild(nameText);
    });

  }, [dag, execution]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="300"
        viewBox="0 0 800 300"
        className="border border-gray-200 rounded bg-white"
      />
    </div>
  );
};

// Metrics Dashboard
const MetricsDashboard = ({ metrics }) => {
  // Generate sample chart data
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: i,
    executions: Math.floor(Math.random() * 20) + 10,
    success_rate: 80 + Math.random() * 15,
    avg_time: 2 + Math.random() * 3
  }));

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{metrics.successRate.toFixed(1)}%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Time</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.avgExecutionTime}s</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Workers</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.activeWorkers}</p>
            </div>
            <Server className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Queue Depth</p>
              <p className="text-3xl font-bold text-orange-600">{metrics.queueDepth}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Execution Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Success Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="success_rate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// AI Insights Component
const AIInsights = () => {
  const [appliedRecommendations, setAppliedRecommendations] = useState(new Set());
  const [isApplying, setIsApplying] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const recommendations = [
    {
      id: 1,
      title: 'Optimize Scheduling',
      description: 'Move ML training to off-peak hours to reduce costs by 30%',
      impact: 'high',
      savings: '$1,200/month'
    },
    {
      id: 2,
      title: 'Resource Right-sizing',
      description: 'Reduce memory allocation for data extraction tasks',
      impact: 'medium',
      savings: '$600/month'
    },
    {
      id: 3,
      title: 'Add Circuit Breakers',
      description: 'Implement retry logic for API calls to improve reliability',
      impact: 'high',
      savings: '2h downtime/month'
    }
  ];

  const handleApplyRecommendation = async (recId) => {
    setIsApplying(recId);
    
    // Simulate applying the recommendation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAppliedRecommendations(prev => new Set([...prev, recId]));
    setIsApplying(null);
    
    // Show success message
    setShowSuccessMessage(recId);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">AI Confidence</p>
              <p className="text-3xl font-bold">89.2%</p>
            </div>
            <Brain className="w-10 h-10 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Optimizations</p>
              <p className="text-3xl font-bold">
                {appliedRecommendations.size}/{recommendations.length}
              </p>
              <p className="text-xs text-green-100 mt-1">Applied</p>
            </div>
            <Target className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Potential Savings</p>
              <p className="text-3xl font-bold">
                ${appliedRecommendations.size > 0 ? 
                  `${(1.8 * (1 + appliedRecommendations.size * 0.2)).toFixed(1)}K` : 
                  '1.8K'
                }
              </p>
              {appliedRecommendations.size > 0 && (
                <p className="text-xs text-blue-100 mt-1">
                  +{(appliedRecommendations.size * 20)}% improvement
                </p>
              )}
            </div>
            <DollarSign className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>
            ✅ Recommendation "{recommendations.find(r => r.id === showSuccessMessage)?.title}" has been applied successfully!
          </span>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          AI Recommendations
          {appliedRecommendations.size === recommendations.length && (
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              All Applied! 🎉
            </span>
          )}
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isApplied = appliedRecommendations.has(rec.id);
            const isCurrentlyApplying = isApplying === rec.id;
            
            return (
              <div key={rec.id} className={`flex items-start space-x-4 p-4 rounded-lg border transition-all ${
                isApplied ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className={`p-2 rounded-lg ${
                  rec.impact === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isApplied ? 'text-green-900' : 'text-gray-900'}`}>
                    {rec.title}
                    {isApplied && <span className="ml-2 text-green-600">✓ Applied</span>}
                  </h4>
                  <p className={`text-sm mt-1 ${isApplied ? 'text-green-700' : 'text-gray-600'}`}>
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-green-600 font-medium">{rec.savings}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.impact} impact
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyRecommendation(rec.id)}
                  disabled={isApplied || isCurrentlyApplying}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    isApplied 
                      ? 'bg-green-600 text-white cursor-default'
                      : isCurrentlyApplying
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  }`}
                >
                  {isCurrentlyApplying ? (
                    <div className="flex items-center">
                      <Loader className="w-3 h-3 mr-1 animate-spin" />
                      Applying...
                    </div>
                  ) : isApplied ? (
                    'Applied'
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN APPLICATION
// =============================================================================

const OrbitalTaskEngine = () => {
  const [user, setUser] = useState(null);
  const [selectedDAG, setSelectedDAG] = useState('data_pipeline');
  const [currentExecution, setCurrentExecution] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentTab, setCurrentTab] = useState('dags');
  const [isDark, setIsDark] = useState(false);
  
  const [engine] = useState(() => new TaskExecutionEngine());

  useEffect(() => {
    if (!user) return;

    const unsubscribe = engine.subscribe((event) => {
      const message = getEventMessage(event);
      setLogs(prev => [...prev.slice(-50), {
        id: Date.now(),
        timestamp: new Date(),
        message
      }]);

      if (event.type === 'execution_started') {
        setCurrentExecution(event.execution);
        setIsExecuting(true);
      } else if (event.type === 'execution_completed') {
        setCurrentExecution(event.execution);
        setExecutions(prev => [event.execution, ...prev.slice(0, 9)]);
        setIsExecuting(false);
      } else if (event.execution) {
        setCurrentExecution(event.execution);
      }
    });

    return unsubscribe;
  }, [user, engine]);

  const getEventMessage = (event) => {
    switch (event.type) {
      case 'execution_started':
        return `🚀 Started execution of DAG: ${event.execution.dag}`;
      case 'execution_completed':
        return `✅ Completed execution with status: ${event.execution.status}`;
      case 'task_started':
        return `▶️ Started task: ${event.task.id}`;
      case 'task_completed':
        return `✅ Completed task: ${event.task.id}`;
      default:
        return 'Unknown event';
    }
  };

  const executeDAG = async () => {
    const dag = SAMPLE_DAGS[selectedDAG];
    if (dag && !isExecuting) {
      await engine.executeDAG(dag);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthModal onLogin={setUser} isOpen={true} />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Orbital</h1>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Task Orchestration Platform</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex space-x-4">
                {[
                  { id: 'dags', label: 'DAGs' },
                  { id: 'monitoring', label: 'Monitoring' },
                  { id: 'ai-insights', label: 'AI Insights' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentTab === tab.id 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</span>
              </div>
              
              <button
                onClick={executeDAG}
                disabled={isExecuting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isExecuting ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                {isExecuting ? 'Executing...' : 'Execute'}
              </button>
              
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleLogout}
                className={`p-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DAGs Tab */}
        {currentTab === 'dags' && (
          <div className="grid grid-cols-12 gap-8">
            {/* DAG Selection */}
            <div className="col-span-3">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-sm border p-6`}>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Available DAGs</h3>
                <div className="space-y-3">
                  {Object.entries(SAMPLE_DAGS).map(([key, dag]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDAG(key)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedDAG === key 
                          ? 'bg-indigo-50 border-2 border-indigo-200' 
                          : `${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border-2`
                      }`}
                    >
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{dag.name}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{dag.description}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                        {dag.tasks.length} tasks • v{dag.version}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main DAG View */}
            <div className="col-span-6">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-sm border p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {SAMPLE_DAGS[selectedDAG].name}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      {SAMPLE_DAGS[selectedDAG].description}
                    </p>
                  </div>
                  {currentExecution && (
                    <TaskStatusBadge status={currentExecution.status} />
                  )}
                </div>
                
                <DAGVisualizer dag={SAMPLE_DAGS[selectedDAG]} execution={currentExecution} />
                
                {/* Task Details */}
                <div className="mt-6">
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Tasks</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {SAMPLE_DAGS[selectedDAG].tasks.map((task) => {
                      const taskExecution = currentExecution?.tasks?.[task.id];
                      return (
                        <div key={task.id} className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.name}</span>
                            <TaskStatusBadge status={taskExecution?.status || 'pending'} />
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div>Type: {task.type}</div>
                            <div>Retries: {task.retries}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="col-span-3">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-sm border p-6`}>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Execution Logs</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.slice(-10).reverse().map((log) => (
                    <div key={log.id} className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded text-xs`}>
                      <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                      <div className={isDark ? 'text-gray-200' : 'text-gray-900'}>{log.message}</div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>
                      No logs yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {currentTab === 'monitoring' && (
          <div>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>System Monitoring</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Real-time performance metrics</p>
            </div>
            <MetricsDashboard metrics={engine.metrics} />
          </div>
        )}

        {/* AI Insights Tab */}
        {currentTab === 'ai-insights' && (
          <div>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>AI Insights</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Intelligent optimization recommendations</p>
            </div>
            <AIInsights />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrbitalTaskEngine;