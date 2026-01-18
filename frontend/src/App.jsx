import { useState } from 'react'
import axios from 'axios'

function App() {
  const [text, setText] = useState('')
  const [findings, setFindings] = useState([])
  const [dismissedIndices, setDismissedIndices] = useState([])
  const [copyStatus, setCopyStatus] = useState('copy text')
  const [isLoading, setIsLoading] = useState(false)

  // Test text designed to trigger institutional abbreviations (T6) and the "Id." sequence logic
  const testText = "the court must first address the standing of the parties. the plaintiff relies heavily on the precedent established in University of California v. Department of Justice, 123 U.S. 456 (2024), which clarified jurisdictional boundaries. furthermore, University of California v. Department of Justice, 123 U.S. 456 (2024) proves that the defense's reliance on Corporation v. Smith, 789 F.Supp. 12 (2020) is misplaced. if the court finds that Microsoft Corporation v. United States, 101 S.Ct. 99 (2018) governs this dispute, it must dismiss the action under Marbury v. Madison, 5 U.S. 137 (1803)."

  const handleScan = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
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
      
      {/* Left side: Editor & About Section */}
      <div style={{ flex: '0 0 65%', padding: '60px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '32px', color: '#54a0ff', margin: 0, letterSpacing: '-0.5px' }}>
              bluebot.
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#a5b1c2', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              the honest legal auditor
            </p>
          </div>

          <a 
            href="https://github.com/saimongh" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', 
              color: '#a5b1c2', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
              padding: '8px 16px', borderRadius: '12px', backgroundColor: 'rgba(165, 177, 194, 0.1)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#54a0ff'; e.currentTarget.style.backgroundColor = 'rgba(84, 160, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#a5b1c2'; e.currentTarget.style.backgroundColor = 'rgba(165, 177, 194, 0.1)'; }}
          >
            <svg height="18" viewBox="0 0 16 16" width="18" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            source code
          </a>
        </header>
        
        <div style={{ position: 'relative', height: '400px', flexShrink: 0, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(84, 160, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '30px',
            fontSize: '17px', lineHeight: '1.8', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
            color: 'transparent', pointerEvents: 'none', zIndex: 1, fontFamily: 'serif'
          }}>
            {renderHighlightedText()}
          </div>

          <textarea 
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%',
              padding: '30px', fontSize: '17px', lineHeight: '1.8', border: 'none', outline: 'none', 
              backgroundColor: 'transparent', color: '#2f3542', resize: 'none', zIndex: 2, fontFamily: 'serif',
              boxSizing: 'border-box'
            }}
            placeholder="paste your legal brief here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', marginBottom: '40px' }}>
          <button 
            onClick={handleScan} 
            disabled={isLoading}
            style={{ 
              flex: 1, padding: '18px', backgroundColor: '#54a0ff', color: 'white', 
              border: 'none', borderRadius: '16px', cursor: isLoading ? 'default' : 'pointer', 
              fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1 
            }}
          >
            {isLoading ? 'waking up the auditor...' : 'run audit'}
          </button>
          <button onClick={copyToClipboard} style={{ flex: 1, padding: '18px', backgroundColor: '#ffffff', color: '#54a0ff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 15px rgba(84, 160, 255, 0.1)' }}>
            {copyStatus}
          </button>
        </div>

        {/* --- ABOUT THIS PROJECT SECTION --- */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(84, 160, 255, 0.1)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', color: '#2f3542', marginTop: 0 }}>About This Project</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '15px' }}>
            Legal writing is defined by precision, yet mechanical citation errors often distract from the weight of an argument. I created <strong>bluebot</strong> as a tool to automate <em>Bluebook Rule 10</em>—helping law students and clerks ensure that institutional abbreviations and sequence formatting (Id.) are flawless.
          </p>

          <h3 style={{ fontSize: '16px', color: '#54a0ff', marginTop: '25px' }}>How to test</h3>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '14px' }}>
            To see the auditor's full logic engine in action, copy the text below and paste it into the editor above:
          </p>
          <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', fontSize: '13px', color: '#a5b1c2', border: '1px solid #e0e6ed', fontStyle: 'italic', position: 'relative' }}>
            {testText}
            <button 
              onClick={() => setText(testText)}
              style={{ display: 'block', marginTop: '10px', background: 'none', border: '1px solid #54a0ff', color: '#54a0ff', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
              insert test text
            </button>
          </div>

          <h3 style={{ fontSize: '16px', color: '#54a0ff', marginTop: '25px' }}>Technical Note: "waking up the auditor"</h3>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '14px', marginBottom: 0 }}>
            This application is hosted on a free-tier server. To remain efficient, the backend "sleeps" during periods of inactivity. The 30-60 second delay you may experience on the first scan is the server's "cold start" process. Subsequent audits will be instantaneous.
          </p>
        </div>
      </div>

      {/* Right side: Audit results */}
      <div style={{ flex: '1', padding: '60px 40px', backgroundColor: '#f9fcff', overflowY: 'auto', borderLeft: '1px solid rgba(84, 160, 255, 0.1)' }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#2f3542' }}>findings</h3>
            {dismissedIndices.length > 0 && (
              <button onClick={restoreAll} style={{ fontSize: '11px', color: '#54a0ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                restore ({dismissedIndices.length})
              </button>
            )}
          </div>
          {hasPassedResults && (
            <button onClick={clearAllPassed} style={{ fontSize: '10px', color: '#a5b1c2', background: 'none', border: '1px solid #d1d8e0', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold' }}>
              clear passed
            </button>
          )}
        </div>
        
        {activeFindings.length === 0 ? (
          <p style={{ color: '#a5b1c2', fontSize: '14px', fontStyle: 'italic' }}>workspace is clear.</p>
        ) : (
          activeFindings.map((finding, index) => (
            <div key={index} style={{ position: 'relative', backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(84, 160, 255, 0.05)', transition: 'transform 0.2s' }}>
              
              <button 
                onClick={() => dismissFinding(finding.start)} 
                style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#d1d8e0', cursor: 'pointer', fontSize: '18px', transition: 'color 0.2s' }}
                onMouseOver={(e) => (e.target.style.color = '#ff7675')}
                onMouseOut={(e) => (e.target.style.color = '#d1d8e0')}
              >
                ×
              </button>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: finding.needs_fix ? '#ff7675' : '#1dd1a1', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {finding.is_repeat ? 'sequence' : (finding.needs_fix ? 'fix needed' : 'perfect')}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: '#2f3542', margin: '0 0 15px 0', lineHeight: '1.5', paddingRight: '20px' }}>{finding.original}</p>
              
              {finding.needs_fix && (
                <div style={{ padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '12px' }}>
                   <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#54a0ff', fontStyle: 'italic', fontWeight: '500' }}>{finding.suggested}</p>
                   <button onClick={() => applyFix(finding)} style={{ width: '100%', padding: '8px', backgroundColor: '#54a0ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                     apply correction
                   </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
