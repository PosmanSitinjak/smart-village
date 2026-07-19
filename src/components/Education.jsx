import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { QUIZ_QUESTIONS } from '../utils/mockData';
import { 
  BookOpen, 
  Award, 
  HelpCircle, 
  Check, 
  X, 
  RotateCcw, 
  ChevronRight,
  BookOpenCheck,
  Leaf,
  AlertCircle,
  User,
  Clock
} from 'lucide-react';

const Education = () => {
  const { addPoints, completedQuizzes, markQuizCompleted, currentUser, openAuthModal, articles } = useContext(AppContext);
  
  // Articles states
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const isQuizAlreadyCompleted = completedQuizzes.includes('quiz_lingkungan_1');
  const isQuizPassed = completedQuizzes.includes('quiz_lingkungan_1') || completedQuizzes.includes('quiz_lingkungan_1_passed');

  // Mini-Quiz inside Article states
  const [artQuizAnswers, setArtQuizAnswers] = useState({});
  const [artQuizSubmitted, setArtQuizSubmitted] = useState(false);
  const [artQuizScore, setArtQuizScore] = useState(0);

  // Reset article mini quiz when active article changes
  useEffect(() => {
    setArtQuizAnswers({});
    setArtQuizSubmitted(false);
    setArtQuizScore(0);
  }, [selectedArticle]);

  // Auto scroll modal body to top when article is selected
  useEffect(() => {
    if (selectedArticle) {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }
  }, [selectedArticle]);

  // Handle option click
  const handleOptionClick = (optionIdx) => {
    if (isSubmitted) return; // Prevent clicking after submit
    setSelectedOption(optionIdx);
  };

  // Submit current answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    
    setIsSubmitted(true);
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];
    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  // Next question or finish
  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const isLastAnswerCorrect = selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer;
      const finalScore = score + (isLastAnswerCorrect ? 1 : 0);
      
      // If perfect score (30/30) and not completed before, reward points
      if (finalScore === 30) {
        if (!isQuizAlreadyCompleted) {
          addPoints(50);
          markQuizCompleted('quiz_lingkungan_1');
        }
      } else if (finalScore >= 25 && finalScore < 30) {
        if (!isQuizPassed) {
          markQuizCompleted('quiz_lingkungan_1_passed');
        }
      }
    }
  };

  // Reset/Restart Quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  // Parse and render article paragraphs with modern cards for list elements
  const renderArticleContent = (content) => {
    return content.split('\n\n').map((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // 1. Check for numbered list items (e.g. "1. Sampah Organik (Sampah Hijau): Merupakan...")
      const numberListMatch = trimmed.match(/^(\d+)\.\s*([^:]+):(.*)$/);
      if (numberListMatch) {
        const num = numberListMatch[1];
        const itemTitle = numberListMatch[2].trim();
        const itemBody = numberListMatch[3].trim();
        
        const isOrganik = itemTitle.toLowerCase().includes('organik');
        const isAnorganik = itemTitle.toLowerCase().includes('anorganik');
        const isB3 = itemTitle.toLowerCase().includes('b3');
        
        let cardClass = 'article-point-card';
        let iconColor = 'var(--text-muted)';
        let IconComponent = BookOpen;

        if (isOrganik) {
          cardClass += ' point-organik';
          iconColor = 'var(--emerald)';
          IconComponent = Leaf;
        } else if (isAnorganik) {
          cardClass += ' point-anorganik';
          iconColor = 'var(--blue)';
          IconComponent = RotateCcw;
        } else if (isB3) {
          cardClass += ' point-b3';
          iconColor = 'var(--red)';
          IconComponent = AlertCircle;
        }

        return (
          <div key={idx} className={cardClass} style={{
            display: 'flex',
            gap: '1.25rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
          }}>
            <div className="point-icon-badge" style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: iconColor,
              border: `1px solid ${iconColor}2a`
            }}>
              <IconComponent size={20} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--text-primary)', fontSize: '0.98rem', fontWeight: '800' }}>
                {num}. {itemTitle}
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {itemBody}
              </p>
            </div>
          </div>
        );
      }

      // 2. Check for textual sequence steps (e.g. "Pertama, efisiensi energi...")
      const isSequenceStep = trimmed.startsWith('Pertama,') || trimmed.startsWith('Kedua,') || trimmed.startsWith('Ketiga,');
      if (isSequenceStep) {
        const commaIdx = trimmed.indexOf(',');
        const stepHeader = trimmed.substring(0, commaIdx + 1);
        const stepRemainder = trimmed.substring(commaIdx + 1).trim();

        // Check if there is a period in the first sentence to split as step title
        const periodIdx = stepRemainder.indexOf('.');
        let stepTitle = "";
        let stepBody = stepRemainder;
        if (periodIdx !== -1) {
          stepTitle = stepRemainder.substring(0, periodIdx + 1);
          stepBody = stepRemainder.substring(periodIdx + 1).trim();
        }

        return (
          <div key={idx} className="article-point-card step-card" style={{
            display: 'flex',
            gap: '1.25rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
          }}>
            <div className="point-icon-badge" style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--mint)',
              border: '1px solid rgba(52, 211, 153, 0.18)',
              fontWeight: '800',
              fontSize: '0.78rem'
            }}>
              {trimmed.startsWith('Pertama') ? '01' : trimmed.startsWith('Kedua') ? '02' : '03'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--text-primary)', fontSize: '0.98rem', fontWeight: '800' }}>
                <span style={{ color: 'var(--mint)' }}>{stepHeader}</span> {stepTitle}
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {stepBody}
              </p>
            </div>
          </div>
        );
      }

      // 3. Default paragraphs
      return (
        <p key={idx} style={{ 
          fontSize: '0.95rem', 
          lineHeight: '1.7', 
          color: 'var(--text-secondary)', 
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="education-container">
      {/* Page Header */}
      <header className="page-header">
        <div className="header-title">
          <h1>Edukasi Lingkungan & Kuis Warga</h1>
          <p>Tingkatkan pengetahuan tentang kelestarian alam dan kumpulkan Eco-Points dengan menyelesaikan kuis desa.</p>
        </div>
      </header>
 
      {/* Main Grid: Articles on left, Quiz on right */}
      <div className="education-grid">
        {/* Left Column: Educational Articles */}
        <section className="articles-section">
          <h2 className="section-title">Artikel Pilihan</h2>
          
          <div className="articles-list-grid">
            {articles.map((art) => (
              <div 
                key={art.id} 
                className="article-card card hover-lift"
                onClick={() => setSelectedArticle(art)}
              >
                <div className="article-img-wrapper">
                  <img src={art.image} alt={art.title} className="article-img" />
                  <span className="article-category-badge">{art.category}</span>
                </div>
                <div className="article-card-body">
                  <span className="read-time-meta">{art.readTime} baca</span>
                  <h3>{art.title}</h3>
                  <p>{art.summary}</p>
                  <span className="btn-read-more">
                    Baca Selengkapnya <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Gamified Quiz Card */}
        <section className="quiz-section">
          <h2 className="section-title">Kuis Warga Hijau</h2>
          
          <div className="quiz-card card">
            {!quizStarted && !quizFinished ? (
              // Quiz Start Screen
              <div className="quiz-start-screen">
                <div className="quiz-badge-container">
                  <Award size={48} className={`badge-icon ${isQuizAlreadyCompleted ? 'text-gold' : 'text-gray-400'}`} />
                </div>
                <h3>Kuis Peduli Lingkungan Desa</h3>
                <p>Uji pemahaman Anda tentang pengelolaan sampah, konservasi air, dan efisiensi energi listrik desa.</p>
                
                <div className="quiz-info-box">
                  <ul>
                    <li><strong>30</strong> Soal Pilihan Ganda</li>
                    <li>Selesaikan dengan minimal <strong>25 Benar</strong> (83%) untuk lulus</li>
                    <li>Benar <strong>30 Soal</strong> untuk dapat <strong>+50 Eco-Points</strong> & <strong>Lencana Emas</strong></li>
                  </ul>
                </div>

                {isQuizPassed && (
                  <div className="alert-completed-badge">
                    <BookOpenCheck size={18} className="text-emerald" />
                    <span>Status Kuis Warga: <strong>Lulus {isQuizAlreadyCompleted ? '(Sempurna)' : '(Cukup)'}</strong></span>
                  </div>
                )}

                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => {
                    if (!currentUser) {
                      openAuthModal('login');
                    } else {
                      setQuizStarted(true);
                    }
                  }}
                >
                  Mulai Kuis Sekarang
                </button>
              </div>
            ) : quizFinished ? (
              // Quiz Results Screen
              <div className="quiz-results-screen">
                {score === 30 ? (
                  // Perfect Score
                  <div className="result-success animate-fade-in">
                    <div className="award-badge-large animate-bounce">
                      <Award size={64} className="text-gold" />
                    </div>
                    <h3>Luar Biasa! Skor Sempurna</h3>
                    <span className="score-badge">{score} / {QUIZ_QUESTIONS.length} Benar</span>
                    <p className="result-text">Selamat, Anda berhasil menjawab seluruh 30 pertanyaan dengan benar! Anda dinobatkan sebagai <strong>Pahlawan Lingkungan SmartVillage</strong> dan tidak perlu mengulang kuis ini.</p>
                    
                    <div className="points-added-alert animate-fade-in">
                      <Check size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                      <span>{isQuizAlreadyCompleted ? 'Kuis telah diklaim sebelumnya' : '+50 Eco-Points ditambahkan ke akun Anda!'}</span>
                    </div>
                  </div>
                ) : score >= 25 ? (
                  // Passed with Good Score (25-29)
                  <div className="result-success animate-fade-in" style={{ borderColor: 'var(--blue)' }}>
                    <div className="award-badge-large">
                      <Award size={64} style={{ color: '#94a3b8' }} />
                    </div>
                    <h3>Anda Lulus Cukup!</h3>
                    <span className="score-badge" style={{ backgroundColor: 'var(--blue)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '30px' }}>{score} / {QUIZ_QUESTIONS.length} Benar</span>
                    <p className="result-text">Kerja bagus! Anda berhasil lulus kuis ini. Namun, untuk mendapatkan Lencana Emas dan +50 Eco-Points, Anda harus menjawab semua 30 soal dengan benar.</p>
                  </div>
                ) : (
                  // Fail Score (< 25) - Wajib Mengulang
                  <div className="result-fail animate-fade-in">
                    <div className="fail-icon-wrapper" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--red)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                      <X size={40} style={{ color: 'var(--red)' }} />
                    </div>
                    <h3 style={{ color: 'var(--red)' }}>Belum Lulus (Wajib Mengulang)</h3>
                    <span className="score-badge badge-red" style={{ backgroundColor: 'var(--red)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '30px' }}>{score} / {QUIZ_QUESTIONS.length} Benar</span>
                    <p className="result-text">Skor Anda di bawah 25. Sesuai aturan desa, Anda <strong>wajib mengulang kuis</strong> ini sampai menjawab minimal 25 pertanyaan dengan benar untuk dinyatakan lulus!</p>
                  </div>
                )}

                <div className="result-actions" style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1.5rem' }}>
                  {score >= 25 && (
                    <button className="btn btn-secondary flex-1" onClick={() => { setQuizStarted(false); setQuizFinished(false); }}>
                      Kembali
                    </button>
                  )}
                  <button className="btn btn-primary flex-1" onClick={handleRestartQuiz} style={score < 25 ? { width: '100%', background: 'var(--red)', borderColor: 'var(--red)' } : {}}>
                    {score < 25 ? 'Ulangi Kuis (Wajib)' : 'Ulangi Kuis (Kejar 100%)'}
                  </button>
                </div>
              </div>
            ) : (
              // Quiz Active Questions Screen
              <div className="quiz-active-screen">
                {/* Progress bar */}
                <div className="quiz-progress-wrapper">
                  <div className="progress-text">
                    <span>Pertanyaan {currentQuestionIdx + 1} dari {QUIZ_QUESTIONS.length}</span>
                    <span>Skor: {score}</span>
                  </div>
                  <div className="quiz-progress-bar-bg">
                    <div 
                      className="quiz-progress-bar-fill"
                      style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h3 className="quiz-question-text">
                  {QUIZ_QUESTIONS[currentQuestionIdx].question}
                </h3>

                {/* Options List */}
                <div className="quiz-options-list">
                  {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectAnswer = idx === QUIZ_QUESTIONS[currentQuestionIdx].answer;
                    
                    let buttonClass = '';
                    if (isSelected) buttonClass = 'option-selected';
                    
                    if (isSubmitted) {
                      if (isCorrectAnswer) buttonClass = 'option-correct';
                      else if (isSelected) buttonClass = 'option-wrong';
                      else buttonClass = 'option-disabled';
                    }

                    return (
                      <button
                        key={idx}
                        className={`quiz-option-btn ${buttonClass}`}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isSubmitted}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="option-text">{option}</span>
                        {isSubmitted && isCorrectAnswer && <Check size={16} className="option-check-icon" />}
                        {isSubmitted && isSelected && !isCorrectAnswer && <X size={16} className="option-check-icon" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Alert */}
                {isSubmitted && (
                  <div className={`quiz-explanation-box animate-fade-in ${selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer ? 'explanation-correct' : 'explanation-wrong'}`}>
                    <strong>Penjelasan:</strong>
                    <p>{QUIZ_QUESTIONS[currentQuestionIdx].explanation}</p>
                  </div>
                )}

                {/* Next/Submit Button */}
                <div className="quiz-actions-footer">
                  {!isSubmitted ? (
                    <button 
                      className="btn btn-primary btn-block" 
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                    >
                      Kirim Jawaban
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-block" onClick={handleNext}>
                      {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? 'Selesai Kuis' : 'Pertanyaan Berikutnya'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Article Detail Modal (Rich Magazine Layout) */}
      {selectedArticle && (
        <div className="modal-backdrop">
          <div className="modal-content card max-w-2xl no-padding">
            
            {/* Header Hero Banner (Merges Title & Banner Image) */}
            <div className="article-hero-banner" style={{ position: 'relative', width: '100%' }}>
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div className="hero-overlay" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)'
              }} />
              
              {/* Top Right Floating Close Button */}
              <button 
                className="btn-close-modal-hero" 
                onClick={() => setSelectedArticle(null)} 
                title="Tutup Artikel"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'var(--transition-smooth)',
                  zIndex: 20
                }}
              >
                <X size={18} />
              </button>

              {/* Title and Category Badge Overlaid */}
              <div className="hero-text-content">
                <span className="badge-category" style={{
                  backgroundColor: selectedArticle.category === 'Sampah' ? 'var(--orange)' : selectedArticle.category === 'Energi' ? 'var(--blue)' : 'var(--emerald)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '30px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  display: 'inline-block',
                  marginBottom: '0.65rem'
                }}>
                  {selectedArticle.category}
                </span>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.45rem',
                  fontWeight: '850',
                  color: '#fff',
                  lineHeight: '1.3',
                  letterSpacing: '-0.5px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                  {selectedArticle.title}
                </h2>
              </div>
            </div>
            
            {/* Scrollable Modal Body */}
            <div className="modal-body article-detail-body">
              {/* Metadata */}
              <div className="article-meta-info">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14} /> Tim Lingkungan SmartVillage</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> Waktu baca: {selectedArticle.readTime}</span>
              </div>

              {/* YouTube Playable Video Embed */}
              {selectedArticle.youtubeId && (
                <div className="article-video-container" style={{ marginBottom: '1.75rem' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    📺 Tonton Video Penjelas (Bisa Langsung Di-play):
                  </span>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedArticle.youtubeId}`}
                      title={selectedArticle.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                  {selectedArticle.sourceUrl && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Sumber Resmi: <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)', fontWeight: 600, textDecoration: 'underline' }}>{selectedArticle.sourceLabel || "YouTube"}</a>
                    </div>
                  )}
                </div>
              )}

              {/* Rich Body Content */}
              <div className="article-full-text" style={{ marginBottom: '2.5rem' }}>
                {renderArticleContent(selectedArticle.content)}
              </div>

              {/* ARTICLE COMPREHENSION MINI-QUIZ (5 QUESTIONS) */}
              {selectedArticle.quizQuestions && selectedArticle.quizQuestions.length === 5 && (
                <div className="article-mini-quiz-section" style={{
                  marginTop: '3rem',
                  padding: '1.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1.5px dashed var(--border-glass-bright)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <HelpCircle size={22} className="text-emerald" style={{ color: 'var(--emerald)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      📝 Uji Pemahaman: Kuis Mini Artikel (5 Soal)
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem', marginTop: '-0.75rem', fontWeight: 650 }}>
                    Jawab seluruh 5 soal di bawah berdasarkan artikel untuk mengklaim bonus **+15 Eco-Points**! (Syarat: Lulus 5/5 Benar)
                  </p>

                  <div className="mini-quiz-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {selectedArticle.quizQuestions.map((qObj, qIdx) => {
                      const selectedOptIdx = artQuizAnswers[qIdx];
                      const isCorrect = selectedOptIdx === qObj.answer;

                      return (
                        <div key={qIdx} className="mini-quiz-item" style={{
                          paddingBottom: '1.25rem',
                          borderBottom: qIdx < 4 ? '1px solid #e2e8f0' : 'none'
                        }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', gap: '0.5rem' }}>
                            <span>{qIdx + 1}.</span>
                            <span>{qObj.question}</span>
                          </h4>

                          <div className="mini-options-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '0.5rem'
                          }}>
                            {qObj.options.map((opt, oIdx) => {
                              const isOptSelected = selectedOptIdx === oIdx;
                              const isOptCorrect = oIdx === qObj.answer;
                              
                              let optBg = '#ffffff';
                              let optBorder = '1px solid #cbd5e1';
                              let optColor = 'var(--text-primary)';
                              let optWeight = '500';

                              if (isOptSelected) {
                                optBg = 'rgba(16, 185, 129, 0.06)';
                                optBorder = '1.5px solid var(--emerald)';
                                optColor = 'var(--emerald)';
                                optWeight = '700';
                              }

                              if (artQuizSubmitted) {
                                if (isOptCorrect) {
                                  optBg = 'rgba(16, 185, 129, 0.15)';
                                  optBorder = '1.5px solid var(--emerald)';
                                  optColor = 'var(--emerald)';
                                  optWeight = '750';
                                } else if (isOptSelected && !isCorrect) {
                                  optBg = 'rgba(239, 68, 68, 0.08)';
                                  optBorder = '1.5px solid var(--red)';
                                  optColor = 'var(--red)';
                                } else {
                                  optBg = '#f8fafc';
                                  optBorder = '1px solid #e2e8f0';
                                  optColor = 'var(--text-muted)';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => {
                                    if (artQuizSubmitted) return;
                                    setArtQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                                  }}
                                  disabled={artQuizSubmitted}
                                  style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: optBg,
                                    border: optBorder,
                                    color: optColor,
                                    fontWeight: optWeight,
                                    textAlign: 'left',
                                    fontSize: '0.82rem',
                                    cursor: artQuizSubmitted ? 'default' : 'pointer',
                                    transition: 'var(--transition-smooth)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                  }}
                                >
                                  <span style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: isOptSelected ? 'var(--emerald)' : '#f1f5f9',
                                    color: isOptSelected ? '#ffffff' : 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.65rem',
                                    fontWeight: '800'
                                  }}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Individual explanation if submitted */}
                          {artQuizSubmitted && (
                            <div style={{
                              marginTop: '0.75rem',
                              padding: '0.65rem 0.85rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.03)',
                              fontSize: '0.75rem',
                              color: isCorrect ? 'var(--emerald)' : 'var(--text-secondary)',
                              borderLeft: isCorrect ? '3px solid var(--emerald)' : '3px solid var(--red)'
                            }}>
                              <strong>{isCorrect ? '✓ Benar' : '✗ Salah'}</strong> — {qObj.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Results Panel */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1', textAlign: 'center' }}>
                    {!artQuizSubmitted ? (
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={Object.keys(artQuizAnswers).length < 5}
                          onClick={() => {
                            let correctCount = 0;
                            selectedArticle.quizQuestions.forEach((qObj, idx) => {
                              if (artQuizAnswers[idx] === qObj.answer) {
                                correctCount++;
                              }
                            });
                            setArtQuizScore(correctCount);
                            setArtQuizSubmitted(true);

                            const isArticleQuizCompleted = completedQuizzes.includes('article_quiz_' + selectedArticle.id);
                            if (correctCount === 5 && !isArticleQuizCompleted) {
                              addPoints(15);
                              markQuizCompleted('article_quiz_' + selectedArticle.id);
                            }
                          }}
                          style={{ minWidth: '200px' }}
                        >
                          Periksa Jawaban
                        </button>
                        {Object.keys(artQuizAnswers).length < 5 && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Selesaikan menjawab seluruh 5 pertanyaan untuk mengirim jawaban.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mini-quiz-results animate-fade-in" style={{ padding: '0.5rem' }}>
                        {artQuizScore === 5 ? (
                          <div style={{ color: 'var(--emerald)', fontWeight: 800 }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                              <Check size={22} style={{ color: 'var(--emerald)' }} />
                              <span>Lulus Sempurna! (5 / 5 Benar)</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                              Selamat! Anda berhasil memahami seluruh artikel dengan sempurna. 
                              <strong> +15 Eco-Points</strong> berhasil diklaim ke profil warga Anda!
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div style={{ color: 'var(--red)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>
                              ✗ Belum Lulus (Skor: {artQuizScore} / 5 Benar)
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                              Anda harus menjawab seluruh 5 pertanyaan dengan benar untuk mendapatkan poin. Jangan berkecil hati, pelajari ulang teks artikel dan coba kembali!
                            </p>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setArtQuizAnswers({});
                                setArtQuizSubmitted(false);
                                setArtQuizScore(0);
                              }}
                            >
                              Coba Kuis Mini Lagi
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="modal-footer article-modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
