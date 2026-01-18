import { useState } from 'react'
import axios from 'axios'

function App() {
  const [text, setText] = useState('')
  const [findings, setFindings] = useState([])
  const [dismissedIndices, setDismissedIndices] = useState([])
  const [copyStatus, setCopyStatus] = useState('copy text')
  const [isLoading, setIsLoading] = useState(false)

  const handleScan = async () => {
    setIsLoading(true);
    try {
      // UPDATED: Points to the specific scan route on your live Render API
      const response = await axios.post('https://bluebot-bqxy.onrender.com/scan-document', { text });
      setFindings(response.data.findings);
      setDismissedIndices([]); 
    } catch (error) {
      console.error("error scanning document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFix = (finding) => {
    const newText = text.slice(0, finding.start) + finding.suggested + text.slice(finding.end);
    setText(newText);
    setFindings(findings.filter(f => f.start !== finding.start));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus('copied!');
      setTimeout(() => setCopyStatus('copy text'), 2000);
    });
  };

  const dismissFinding = (startIndex) => setDismissedIndices([...dismissedIndices, startIndex]);
  const restoreAll = () => setDismissedIndices([]);

  const clearAllPassed = () => {
    const passedIndices = findings.filter(f => !f.needs_fix).map(f => f.start);
    setDismissedIndices(prev => [...new Set([...prev, ...passedIndices])]);
  };

  const renderHighlightedText = () => {
    if (!text) return null;
    let highlighted = [];
    let lastIndex = 0;
    const visibleFindings = findings.filter(f => !dismissedIndices.includes(f.start)).sort((a, b) => a.start - b.start);
    visibleFindings.forEach((finding, i) => {
      highlighted.push(text.slice(lastIndex, finding.start));
      highlighted.push(
        <mark key={i} style={{ backgroundColor: 'transparent', borderBottom: '2px dotted #ff9ff3', color: 'transparent' }}>
          {text.slice(finding.start, finding.end)}
        </mark>
      );
      lastIndex = finding.end;
    });
    highlighted.push(text.slice(lastIndex));
    return highlighted;
  };

  const activeFindings = findings.filter(f => !dismissedIndices.includes(f.start));
  const hasPassedResults = activeFindings.some(f => !f.needs_fix);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: '"Inter", sans-serif', backgroundColor: '#f0f7ff', overflow: 'hidden' }}>
      
      <div style={{ flex: '0 0 65%', padding: '60px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '32px', color: '#54a0ff', margin: 0, letterSpacing: '-0.5px' }}>bluebot.</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#a5b1c2', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>the honest legal auditor</p>
          </div>
          <a href="https://github.com/saimongh/bluebot/blob/main/README.md" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#a5b1c2', fontSize: '13px', fontWeight: '600', padding: '8px 16px', borderRadius: '12px', backgroundColor: 'rgba(165, 177, 194, 0.1)' }}>Source Code</a>
        </header>
        
        <div style={{ position: 'relative', flex: 1, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(84, 160, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '30px', fontSize: '17px', lineHeight: '1.8', whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: 'transparent', pointerEvents: 'none', zIndex: 1, fontFamily: 'serif' }}>
            {renderHighlightedText()}
          </div>
          <textarea style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', padding: '30px', fontSize: '17px', lineHeight: '1.8', border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#2f3542', resize: 'none', zIndex: 2, fontFamily: 'serif' }} placeholder="paste your legal brief here..." value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <button onClick={handleScan} disabled={isLoading} style={{ flex: 1, padding: '18px', backgroundColor: '#54a0ff', color: 'white', border: 'none', borderRadius: '16px', cursor: isLoading ? 'default' : 'pointer', fontWeight: '600', fontSize: '15px', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Waking up the auditor...' : 'run audit'}
          </button>
          <button onClick={copyToClipboard} style={{ flex: 1, padding: '18px', backgroundColor: '#ffffff', color: '#54a0ff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 15px rgba(84, 160, 255, 0.1)' }}>{copyStatus}</button>
        </div>
      </div>

      <div style={{ flex: '1', padding: '60px 40px', backgroundColor: '#f9fcff', overflowY: 'auto', borderLeft: '1px solid rgba(84, 160, 255, 0.1)' }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#2f3542' }}>findings</h3>
            {dismissedIndices.length > 0 && <button onClick={restoreAll} style={{ fontSize: '11px', color: '#54a0ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>restore ({dismissedIndices.length})</button>}
          </div>
          {hasPassedResults && <button onClick={clearAllPassed} style={{ fontSize: '10px', color: '#a5b1c2', background: 'none', border: '1px solid #d1d8e0', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold' }}>clear passed</button>}
        </div>
        
        {activeFindings.length === 0 ? <p style={{ color: '#a5b1c2', fontSize: '14px', fontStyle: 'italic' }}>workspace is clear.</p> : activeFindings.map((finding, index) => (
            <div key={index} style={{ position: 'relative', backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(84, 160, 255, 0.05)', borderLeft: finding.is_repeat ? '6px solid #ff7675' : (finding.needs_fix ? '6px solid #54a0ff' : '6px solid #1dd1a1') }}>
              <button onClick={() => dismissFinding(finding.start)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#d1d8e0', cursor: 'pointer', fontSize: '18px' }}>×</button>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: finding.is_repeat ? '#ff7675' : (finding.needs_fix ? '#54a0ff' : '#1dd1a1'), fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {finding.is_repeat ? 'Sequence Alert' : (finding.needs_fix ? 'Fix Needed' : 'Passed')}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#2f3542', margin: '0 0 15px 0', lineHeight: '1.5', paddingRight: '20px' }}>{finding.original}</p>
              {finding.needs_fix && (
                <div style={{ padding: '15px', backgroundColor: finding.is_repeat ? '#fff5f5' : '#f0f7ff', borderRadius: '12px' }}>
                   <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: finding.is_repeat ? '#ff7675' : '#54a0ff', fontStyle: 'italic', fontWeight: '600' }}>{finding.suggested}</p>
                   <button onClick={() => applyFix(finding)} style={{ width: '100%', padding: '8px', backgroundColor: finding.is_repeat ? '#ff7675' : '#54a0ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                     apply {finding.is_repeat ? 'short form' : 'correction'}
                   </button>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
