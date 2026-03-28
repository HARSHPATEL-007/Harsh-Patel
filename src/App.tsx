import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  History, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Database, 
  Lock, 
  Search,
  ChevronRight,
  ExternalLink,
  Plus,
  Loader2,
  Clock,
  User,
  Settings
} from 'lucide-react';
import { Decision, AuditLog, Regulation, UserContext } from './types';
import { HIPAA_REGULATIONS, EXAMPLE_SCENARIOS } from './constants';
import { analyzeScenario } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const Header = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            SovereignHealth AI
          </span>
        </div>
        <nav className="hidden md:flex space-x-8">
          {[
            { id: 'analyze', label: 'Analyze', icon: Activity },
            { id: 'history', label: 'History', icon: History },
            { id: 'audit', label: 'Audit Trail', icon: FileText },
            { id: 'regulations', label: 'Regulations', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Zero-Trust Active</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const DecisionCard = ({ decision }: { decision: Decision }) => {
  const statusColors = {
    'Compliant': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Non-Compliant': 'text-red-400 bg-red-400/10 border-red-400/20',
    'Requires Review': 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  };

  const riskColors = {
    'Low': 'text-blue-400',
    'Medium': 'text-amber-400',
    'High': 'text-orange-400',
    'Critical': 'text-red-400'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${statusColors[decision.complianceStatus]}`}>
              {decision.complianceStatus}
            </span>
            <span className={`text-sm font-medium ${riskColors[decision.riskLevel]}`}>
              {decision.riskLevel} Risk
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-100">{decision.summary}</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">ID: {decision.id} • {new Date(decision.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center" title="HIPAA Privacy Rule">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center" title="Zero-Trust Enforced">
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800">
        {/* Logic Trace */}
        <div className="bg-slate-900/80 p-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Chain-of-Thought Logic
          </h4>
          <ul className="space-y-4">
            {decision.logicTrace.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-blue-500 font-mono text-sm">0{i + 1}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* PHI & Anomalies */}
        <div className="bg-slate-900/80 p-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> PHI & Anomalies
          </h4>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">PHI Elements Detected</p>
              <div className="flex flex-wrap gap-2">
                {decision.phiDetected.map((phi, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300" title={phi.reason}>
                    {phi.type}: <span className="text-blue-400">{phi.value}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Compliance Anomalies</p>
              <div className="space-y-2">
                {decision.anomalies.map((anomaly, i) => (
                  <div key={i} className="p-3 bg-red-400/5 border border-red-400/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-red-400 uppercase">{anomaly.severity} Severity</span>
                      <span className="text-[10px] font-mono text-slate-500">{anomaly.regulationReference}</span>
                    </div>
                    <p className="text-sm text-slate-300">{anomaly.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-950/50 border-t border-slate-800">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sovereignty Classification</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-2 font-medium">Data Field</th>
                    <th className="pb-2 font-medium">Classification</th>
                    <th className="pb-2 font-medium">Encryption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {decision.sovereignty.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 text-slate-300 font-mono text-xs">{item.field}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.classification === 'Sovereign-Bound' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="py-2">
                        {item.encryptionRequired ? (
                          <span className="text-green-500 flex items-center gap-1 text-[10px] uppercase font-bold">
                            <Lock className="w-3 h-3" /> Required
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px] uppercase font-bold">Optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Actionable Recommendations</h4>
            <ul className="space-y-2">
              {decision.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [scenario, setScenario] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [decRes, auditRes] = await Promise.all([
        fetch('/api/decisions'),
        fetch('/api/audit-logs')
      ]);
      const decData = await decRes.json();
      const auditData = await auditRes.json();
      setHistory(decData);
      setAuditLogs(auditData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleAnalyze = async () => {
    if (!scenario.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setCurrentDecision(null);

    try {
      // 1. Log the attempt
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ANALYSIS_STARTED',
          userId: 'hvipatel007@gmail.com',
          details: 'Scenario analysis initiated via Gemini 3.1 Pro'
        })
      });

      // 2. Perform AI analysis
      const decision = await analyzeScenario(scenario);
      setCurrentDecision(decision);

      // 3. Save to backend
      await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          userContext: { userId: 'hvipatel007@gmail.com', role: 'auditor', organization: 'SovereignHealth' }
        })
      });

      // 4. Refresh history
      fetchData();
    } catch (err) {
      setError("Analysis failed. Please ensure your Gemini API key is configured correctly.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = (ex: any) => {
    setScenario(ex.scenario);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" /> Analyze Scenario
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                      Submit a healthcare AI scenario for HIPAA compliance analysis, Zero-Trust validation, and Sovereign Cloud classification.
                    </p>
                    
                    <div className="space-y-4">
                      <textarea
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        placeholder="Describe the data flow, storage, and access patterns..."
                        className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                      
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !scenario.trim()}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing with AI...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            Analyze with AI
                          </>
                        )}
                      </button>

                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Example Scenarios</h3>
                    <div className="space-y-3">
                      {EXAMPLE_SCENARIOS.map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => loadExample(ex)}
                          className="w-full text-left p-3 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
                        >
                          <p className="text-sm font-medium text-slate-300 group-hover:text-blue-400 transition-colors">{ex.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1">{ex.scenario}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {currentDecision ? (
                    <DecisionCard decision={currentDecision} />
                  ) : (
                    <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 p-12 text-center">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-400">No Analysis Results</h3>
                      <p className="max-w-xs mt-2">Submit a scenario on the left to generate a HIPAA-compliant decision and audit trail.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Decision History</h2>
                <div className="text-sm text-slate-400">{history.length} Decisions Recorded</div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {history.length > 0 ? (
                  history.map((dec) => (
                    <div key={dec.id} className="opacity-80 hover:opacity-100 transition-opacity">
                      <DecisionCard decision={dec} />
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border border-slate-800 rounded-xl bg-slate-900/50">
                    <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No decision history found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Immutable Audit Trail
                </h2>
                <span className="text-xs font-mono text-slate-500">SECURE LOGGING ENABLED</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
                      <th className="p-4 font-medium uppercase tracking-wider text-[10px]">Timestamp</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-[10px]">Action</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-[10px]">User</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-[10px]">Details</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-slate-400 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-300 uppercase">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{log.userId}</td>
                        <td className="p-4 text-slate-400 max-w-md truncate">{log.details}</td>
                        <td className="p-4">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'regulations' && (
            <motion.div
              key="regulations"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {HIPAA_REGULATIONS.map((reg) => (
                <div key={reg.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded uppercase">{reg.citation}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{reg.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{reg.description}</p>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Requirements</p>
                    {reg.keyRequirements.map((req, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4" /> HIPAA Compliant
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest">
              <Lock className="w-4 h-4" /> Zero-Trust
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest">
              <Database className="w-4 h-4" /> Sovereign Cloud
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 SovereignHealth AI Audit Engine. Built for Regulated AI in Healthcare.
          </p>
        </div>
      </footer>
    </div>
  );
}
