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
  Clock,
  ArrowLeft
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

  // Auto scroll window to top when article is selected
  useEffect(() => {
    if (selectedArticle) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedArticle]);

  // Handle option click
  const handleOptionClick = (optionIdx) => {
    if (isSubmitted) return;
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

  // Reset quiz to retry
  const handleResetQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Helper to render formatted article text
  const renderArticleContent = (contentStr) => {
    if (!contentStr) return null;

    const paragraphs = contentStr.split('\n\n');
    return paragraphs.map((pText, idx) => {
      const trimmed = pText.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} style={{ 
            fontSize: '1.4rem', 
            fontWeight: 800, 
            color: 'var(--text-primary)', 
            marginTop: '2rem', 
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} style={{ 
            fontSize: '1.15rem', 
            fontWeight: 750, 
            color: 'var(--text-primary)', 
            marginTop: '1.5rem', 
            marginBottom: '0.75rem',
            lineHeight: '1.35'
          }}>
            {trimmed.replace('## ', '')}
          </h3>
        );
      }

      return (
        <p key={idx} style={{ 
          fontSize: '0.95rem', 
          lineHeight: '1.75', 
          color: 'var(--text-secondary)', 
          marginBottom: '1.35rem',
          textAlign: 'left'
        }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="education-container">
      {selectedArticle ? (
        /* Standalone Article Reader View (NO list behind it!) */
        <div className="single-article-view card no-padding animate-fade-in">
          {/* Top Sticky Bar */}
          <div className="article-standalone-bar">
            <button 
              className="btn btn-secondary btn-sm btn-article-back" 
              onClick={() => setSelectedArticle(null)}
            >
              <ArrowLeft size={16} /> 
              <span className="btn-back-text">Kembali ke Daftar Artikel</span>
              <span className="btn-back-text-mobile">Kembali</span>
            </button>
            <span className="badge-category" style={{
              backgroundColor: selectedArticle.category === 'Sampah' ? 'var(--orange)' : selectedArticle.category === 'Energi' ? 'var(--blue)' : 'var(--emerald)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '0.3rem 0.75rem',
              borderRadius: '30px',
              textTransform: 'uppercase'
            }}>
              {selectedArticle.category}
            </span>
          </div>

          {/* Hero Banner Image */}
          <div className="article-standalone-banner">
            <img src={selectedArticle.image} alt={selectedArticle.title} />
          </div>

          {/* Main Article Body */}
          <div className="article-standalone-body">
            <h1 className="article-standalone-title">{selectedArticle.title}</h1>
            
            <div className="article-meta-info" style={{ marginBottom: '1.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14} /> Tim Lingkungan SmartVillage</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> Waktu baca: {selectedArticle.readTime}</span>
            </div>

            {/* YouTube Video Embed */}
            {selectedArticle.youtubeId && (
              <div className="article-video-container" style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>
                  📺 Tonton Video Penjelas (Bisa Langsung Di-play):
                </span>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
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
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sumber Resmi: <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)', fontWeight: 600, textDecoration: 'underline' }}>{selectedArticle.sourceLabel || "YouTube"}</a>
                  </div>
                )}
              </div>
            )}

            {/* Article Text */}
            <div className="article-full-text" style={{ marginBottom: '2.5rem' }}>
              {renderArticleContent(selectedArticle.content)}
            </div>

            {/* Mini Quiz Section */}
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

          {/* Bottom Standalone Actions Footer */}
          <div className="article-standalone-footer">
            <button 
              className="btn btn-primary" 
              onClick={() => setSelectedArticle(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
            >
              <ArrowLeft size={16} /> Selesai Membaca & Kembali
            </button>
          </div>
        </div>
      ) : (
        /* Normal Education View: Articles List + Gamified Quiz */
        <>
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
                  /* Quiz Start Screen */
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
                  /* Quiz Results Screen */
                  <div className="quiz-results-screen">
                    {score === 30 ? (
                      <div className="result-success animate-fade-in">
                        <div className="award-badge-large animate-bounce">
                          <Award size={64} className="text-gold" />
                        </div>
                        <h3>Luar Biasa! Skor Sempurna</h3>
                        <span className="score-badge">{score} / {QUIZ_QUESTIONS.length} Benar</span>
                        <p className="result-text">Selamat, Anda berhasil menjawab seluruh 30 pertanyaan dengan benar! Anda dinobatkan sebagai <strong>Pahlawan Lingkungan SmartVillage</strong> dan tidak perlu mengulang kuis ini.</p>
                        
                        <div className="points-added-alert animate-fade-in">
                          <Leaf size={20} className="text-emerald" />
                          <span>Bonus <strong>+50 Eco-Points</strong> berhasil ditambahkan ke akun Anda!</span>
                        </div>

                        <button className="btn btn-primary btn-block" onClick={() => setQuizFinished(false)} style={{ marginTop: '1.5rem' }}>
                          Kembali ke Halaman Edukasi
                        </button>
                      </div>
                    ) : score >= 25 ? (
                      <div className="result-pass animate-fade-in">
                        <div className="award-badge-large">
                          <Award size={64} className="text-emerald" />
                        </div>
                        <h3>Selamat! Anda Lulus Kuis</h3>
                        <span className="score-badge">{score} / {QUIZ_QUESTIONS.length} Benar</span>
                        <p className="result-text">Hasil Anda sangat baik! Anda telah memenuhi kualifikasi Warga Peduli Lingkungan Desa.</p>
                        <p className="result-tip" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                          💡 Petunjuk: Dapatkan 30/30 Benar untuk mengklaim +50 Eco-Points dan Lencana Emas.
                        </p>
                        <div className="results-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                          <button className="btn btn-secondary" onClick={handleResetQuiz} style={{ flex: 1 }}>
                            Coba Ulang Kuis
                          </button>
                          <button className="btn btn-primary" onClick={() => setQuizFinished(false)} style={{ flex: 1 }}>
                            Selesai
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="result-fail animate-fade-in">
                        <div className="award-badge-large">
                          <AlertCircle size={64} className="text-orange" />
                        </div>
                        <h3>Belum Lulus Kuis</h3>
                        <span className="score-badge score-fail">{score} / {QUIZ_QUESTIONS.length} Benar</span>
                        <p className="result-text">Anda perlu minimal 25 jawaban benar untuk lulus kuis ini. Silakan baca artikel edukasi desa dan coba kembali!</p>
                        <button className="btn btn-primary btn-block" onClick={handleResetQuiz} style={{ marginTop: '1.5rem' }}>
                          <RotateCcw size={16} /> Coba Ulang Kuis
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Active Quiz Questions View */
                  <div className="quiz-questions-screen">
                    <div className="quiz-progress-bar">
                      <div className="progress-header">
                        <span>Pertanyaan {currentQuestionIdx + 1} dari {QUIZ_QUESTIONS.length}</span>
                        <span>{Math.round(((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="question-content">
                      <span className="question-category">{QUIZ_QUESTIONS[currentQuestionIdx].category}</span>
                      <h4 className="question-title">{QUIZ_QUESTIONS[currentQuestionIdx].question}</h4>

                      <div className="options-list">
                        {QUIZ_QUESTIONS[currentQuestionIdx].options.map((optionText, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIdx].answer;
                          
                          let btnClass = "option-button";
                          if (isSubmitted) {
                            if (isCorrect) btnClass += " correct";
                            else if (isSelected) btnClass += " wrong";
                          } else if (isSelected) {
                            btnClass += " selected";
                          }

                          return (
                            <button
                              key={idx}
                              className={btnClass}
                              onClick={() => handleOptionClick(idx)}
                              disabled={isSubmitted}
                            >
                              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                              <span className="option-text">{optionText}</span>
                              {isSubmitted && isCorrect && <Check size={18} className="option-status-icon" />}
                              {isSubmitted && isSelected && !isCorrect && <X size={18} className="option-status-icon" />}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div className="explanation-box animate-fade-in">
                          <strong>Penjelasan:</strong> {QUIZ_QUESTIONS[currentQuestionIdx].explanation}
                        </div>
                      )}
                    </div>

                    <div className="quiz-actions">
                      {!isSubmitted ? (
                        <button 
                          className="btn btn-primary btn-block"
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null}
                        >
                          Kirim Jawaban
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-block"
                          onClick={handleNext}
                        >
                          {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil Kuis'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Education;
