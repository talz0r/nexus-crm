import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured, missingFirebaseKeys } from "./firebase.js";
import CRM from "./CRM.jsx";
import { Target, Mail, Lock, User, AlertTriangle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

const C = {
  bg: "#0b0e14", surface: "#151921", border: "#1e2736", text: "#e2e8f0",
  textM: "#8892a4", textD: "#4a5568", accent: "#6366f1", accentH: "#818cf8",
  ok: "#34d399", danger: "#f87171",
  grad: "linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login"); // login | register | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAuthErrorMessage = (err, fallback) => {
    if (!err?.code) return fallback;

    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      return "אימייל או סיסמה שגויים";
    }
    if (err.code === "auth/too-many-requests") {
      return "יותר מדי ניסיונות, נסה שוב מאוחר יותר";
    }
    if (err.code === "auth/email-already-in-use") {
      return "האימייל כבר רשום במערכת";
    }
    if (err.code === "auth/weak-password") {
      return "סיסמה חלשה מדי";
    }
    if (err.code === "auth/invalid-api-key" || err.code === "auth/api-key-not-valid") {
      return "הגדרות Firebase חסרות או לא תקינות. ודא שקובץ .env מוגדר נכון ושדומיין האתר מאושר ב-Firebase Authentication > Settings > Authorized domains.";
    }

    return fallback;
  };

  const setupSteps = [
    "צור קובץ .env מתוך .env.example",
    "הדבק את ערכי Firebase Web App מתוך Firebase Console",
    "הוסף את הדומיין שלך ל-Authorized domains",
    "בצע Deploy מחדש לאחר עדכון משתני סביבה",
  ];

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase לא הוגדר. בדוק קובץ .env והפעל את השרת מחדש.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const uiError = getAuthErrorMessage(err, "שגיאה בהתחברות, בדוק את הגדרות Firebase ונסה שוב");
      setError(uiError);
    }
    setSubmitting(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!auth || !db) {
      setError("Firebase לא הוגדר. בדוק קובץ .env והפעל את השרת מחדש.");
      return;
    }
    setError("");
    if (password.length < 6) { setError("סיסמה חייבת להכיל לפחות 6 תווים"); return; }
    if (!name.trim()) { setError("נא למלא שם"); return; }
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Save user profile to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        role: "sales",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      const uiError = getAuthErrorMessage(err, "שגיאה בהרשמה, בדוק את הגדרות Firebase ונסה שוב");
      setError(uiError);
    }
    setSubmitting(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase לא הוגדר. בדוק קובץ .env והפעל את השרת מחדש.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("קישור לאיפוס סיסמה נשלח לאימייל שלך");
    } catch (err) {
      setError("לא הצלחנו לשלוח מייל איפוס");
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  if (loading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulse 1.5s infinite" }}>
            <Target size={24} color="#fff" />
          </div>
          <div style={{ color: C.textM, fontSize: 14, fontFamily: "'Rubik',sans-serif" }}>טוען...</div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    const ff = "'Rubik','Segoe UI',sans-serif";
    return (
      <div dir="rtl" style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 600, background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, padding: "26px 24px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <AlertTriangle size={18} color={C.danger} />
            <h2 style={{ color: C.text, fontSize: 20, margin: 0 }}>המערכת לא הוגדרה עדיין</h2>
          </div>
          <p style={{ color: C.textM, marginBottom: 12, lineHeight: 1.7 }}>
            חסרים משתני סביבה של Firebase ולכן אי אפשר להתחבר כרגע.
          </p>
          <p style={{ color: C.text, marginBottom: 8, fontWeight: 600 }}>משתנים חסרים:</p>
          <code style={{ display: "block", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, color: C.ok, marginBottom: 16 }}>
            {missingFirebaseKeys.join(", ")}
          </code>

          <ol style={{ color: C.textM, paddingRight: 20, margin: 0, lineHeight: 1.8 }}>
            {setupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (user) {
    return <CRM currentUser={user} onLogout={handleLogout} />;
  }

  // ═══ LOGIN / REGISTER / RESET SCREEN ═══
  const ff = "'Rubik','Segoe UI',sans-serif";
  const iS = { width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: ff, outline: "none", boxSizing: "border-box", transition: "border .2s" };
  const bP = { width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.accent, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: ff, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };

  return (
    <div dir="rtl" style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
        button:hover{opacity:.9}button:active{transform:scale(.98)}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, animation: "slideUp .3s" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.grad, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Target size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6, background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nexus CRM</h1>
          <p style={{ color: C.textM, fontSize: 14 }}>
            {mode === "login" && "היכנס לחשבון שלך"}
            {mode === "register" && "צור חשבון חדש"}
            {mode === "reset" && "איפוס סיסמה"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          {/* Error / Success */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#f8717118", border: "1px solid #f8717130", marginBottom: 16 }}>
              <AlertTriangle size={16} color={C.danger} />
              <span style={{ fontSize: 13, color: C.danger }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#34d39918", border: "1px solid #34d39930", marginBottom: 16 }}>
              <CheckCircle2 size={16} color={C.ok} />
              <span style={{ fontSize: 13, color: C.ok }}>{success}</span>
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleReset}>
            {/* Name field (register only) */}
            {mode === "register" && (
              <div style={{ position: "relative", marginBottom: 14 }}>
                <User size={18} style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", color: C.textD }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="שם מלא" style={iS} required />
              </div>
            )}

            {/* Email */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Mail size={18} style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", color: C.textD }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" style={iS} required dir="ltr" />
            </div>

            {/* Password (not for reset) */}
            {mode !== "reset" && (
              <div style={{ position: "relative", marginBottom: 20 }}>
                <Lock size={18} style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", color: C.textD }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="סיסמה"
                  style={iS}
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {showPw ? <EyeOff size={18} color={C.textD} /> : <Eye size={18} color={C.textD} />}
                </button>
              </div>
            )}

            {/* Forgot password link */}
            {mode === "login" && (
              <div style={{ textAlign: "left", marginBottom: 18, marginTop: -10 }}>
                <button type="button" onClick={() => { setMode("reset"); setError(""); setSuccess("") }} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer", fontFamily: ff }}>
                  שכחת סיסמה?
                </button>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={submitting} style={{ ...bP, opacity: submitting ? 0.7 : 1 }}>
              {submitting && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
              {mode === "login" && "התחבר"}
              {mode === "register" && "צור חשבון"}
              {mode === "reset" && "שלח קישור איפוס"}
            </button>
          </form>

          {/* Switch mode */}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.textM }}>
            {mode === "login" && (
              <>
                אין לך חשבון?{" "}
                <button onClick={() => { setMode("register"); setError(""); setSuccess("") }} style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, cursor: "pointer", fontFamily: ff, fontSize: 13 }}>
                  הירשם
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                כבר יש לך חשבון?{" "}
                <button onClick={() => { setMode("login"); setError(""); setSuccess("") }} style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, cursor: "pointer", fontFamily: ff, fontSize: 13 }}>
                  התחבר
                </button>
              </>
            )}
            {mode === "reset" && (
              <button onClick={() => { setMode("login"); setError(""); setSuccess("") }} style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, cursor: "pointer", fontFamily: ff, fontSize: 13 }}>
                ← חזור להתחברות
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: C.textD }}>
          Nexus CRM © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
