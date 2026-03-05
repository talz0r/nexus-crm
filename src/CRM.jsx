import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import * as XLSX from "xlsx";
import { Search, Plus, Phone, Mail, Building2, User, TrendingUp, CheckCircle2, Clock, Calendar, ChevronDown, ChevronRight, ChevronLeft, Edit3, Trash2, X, BarChart3, Users, Briefcase, ListTodo, Globe, DollarSign, Target, ArrowUpRight, ArrowDownRight, Star, StarOff, Upload, FileSpreadsheet, Shield, ShieldCheck, ShieldAlert, Eye, Lock, Unlock, ChevronUp, AlertTriangle, Check, FileText, Send, MessageSquare, Bell, Tag, Filter, Download, Video, Hash, Sun, Moon, Menu, Command, ArrowRight, Zap, GripVertical, Link2, ExternalLink, Activity, PieChart as PieIcon, LogOut } from "lucide-react";
import { db } from "./firebase.js";
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from "firebase/firestore";

// ═══ THEME ═══
const themes = {
  dark: { bg:"#0b0e14", surface:"#151921", surfaceH:"#1c2333", surfaceAlt:"#111620", border:"#1e2736", borderL:"#2a3548", text:"#e2e8f0", textM:"#8892a4", textD:"#4a5568", accent:"#6366f1", accentH:"#818cf8", accentS:"rgba(99,102,241,.1)", grad:"linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)", gradText:"linear-gradient(135deg,#818cf8,#c084fc)", ok:"#34d399", warn:"#fbbf24", danger:"#f87171", cardShadow:"0 1px 3px rgba(0,0,0,.3)", modalBg:"rgba(0,0,0,.7)" },
  light: { bg:"#f5f7fb", surface:"#ffffff", surfaceH:"#f0f2f7", surfaceAlt:"#f8f9fc", border:"#e2e8f0", borderL:"#cbd5e1", text:"#1e293b", textM:"#64748b", textD:"#94a3b8", accent:"#6366f1", accentH:"#818cf8", accentS:"rgba(99,102,241,.08)", grad:"linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)", gradText:"linear-gradient(135deg,#6366f1,#8b5cf6)", ok:"#10b981", warn:"#f59e0b", danger:"#ef4444", cardShadow:"0 1px 3px rgba(0,0,0,.06)", modalBg:"rgba(0,0,0,.4)" },
};

// ═══ i18n (compact) ═══
const i={
  he:{appName:"נקסוס CRM",dashboard:"דשבורד",contacts:"אנשי קשר",deals:"עסקאות",tasks:"משימות",admin:"ניהול",calendar:"יומן",reports:"דוחות",search:"חיפוש...",addContact:"איש קשר חדש",addDeal:"עסקה חדשה",addTask:"משימה חדשה",totalRevenue:"הכנסות צפויות",activeDeals:"עסקאות פעילות",totalContacts:"סה״כ אנשי קשר",pendingTasks:"משימות ממתינות",name:"שם",email:"אימייל",phone:"טלפון",company:"חברה",status:"סטטוס",value:"ערך",stage:"שלב",priority:"עדיפות",dueDate:"תאריך יעד",description:"תיאור",save:"שמור",cancel:"ביטול",delete:"מחק",edit:"ערוך",lead:"ליד",customer:"לקוח",prospect:"פוטנציאלי",inactive:"לא פעיל",qualification:"סינון",proposal:"הצעה",negotiation:"משא ומתן",closed_won:"נסגר ✓",closed_lost:"נסגר ✗",low:"נמוכה",medium:"בינונית",high:"גבוהה",urgent:"דחוף",todo:"לביצוע",in_progress:"בתהליך",done:"הושלם",overdue:"באיחור",all:"הכל",starred:"מסומנים",address:"כתובת",notes:"הערות",relatedContact:"איש קשר",noResults:"לא נמצאו תוצאות",closingRate:"אחוז סגירה",avgDealSize:"ממוצע עסקה",revenueOverTime:"הכנסות לאורך זמן",dealsByStage:"עסקאות לפי שלב",recentActivity:"פעילות אחרונה",topDeals:"עסקאות מובילות",monthS:["ינו","פבר","מרץ","אפר","מאי","יונ","יול","אוג","ספט","אוק","נוב","דצמ"],monthL:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],dayN:["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"],importExcel:"ייבוא אקסל",importContacts:"ייבוא אנשי קשר",dragDrop:"גררו קובץ או לחצו",rowsFound:"שורות",mapColumns:"מיפוי עמודות",skipFirst:"דלג על כותרות",importBtn:"ייבוא",importing:"מייבא...",importedCount:"אנשי קשר יובאו",skip:"דלג",downloadTemplate:"הורד תבנית",addUser:"הוספת משתמש",role:"תפקיד",permissions:"הרשאות",adminRole:"מנהל",managerRole:"מנהל צוות",salesRole:"מכירות",viewerRole:"צופה",active:"פעיל",suspended:"מושעה",lastLogin:"כניסה אחרונה",editPermissions:"עריכת הרשאות",department:"מחלקה",sales:"מכירות",marketing:"שיווק",support:"תמיכה",management:"הנהלה",selectAll:"בחר הכל",deselectAll:"בטל הכל",exportExcel:"ייצוא לאקסל",exportSuccess:"יוצא בהצלחה",commLog:"לוג תקשורת",sendEmail:"שלח מייל",newMeeting:"פגישה חדשה",meetingTitle:"כותרת",meetingTime:"שעה",today:"היום",notifications:"התראות",markAllRead:"סמן כנקרא",tags:"תגיות",advancedSearch:"חיפוש מתקדם",clearFilters:"נקה",totalPipeline:"סה״כ בצינור",weightedValue:"ערך משוקלל",emailTemplates:"תבניות",useTemplate:"השתמש",subject:"נושא",message:"הודעה",timeline:"ציר זמן",quickActions:"פעולות מהירות",typeToSearch:"הקלד לחיפוש...",goTo:"עבור אל",create:"צור חדש",details:"פרטים",contactDeals:"עסקאות",contactTasks:"משימות",contactLog:"תקשורת",sendWhatsapp:"WhatsApp",addToCalendar:"הוסף ליומן",integrations:"אינטגרציות",dragToMove:"גרור להעברה",pipeline:"צינור מכירות",summaryReport:"דוח סיכום",contactsReport:"דוח אנשי קשר",dealsReport:"דוח עסקאות",tasksReport:"דוח משימות",callLog:"שיחה",emailLog:"מייל",meetingLog:"פגישה",noteLog:"הערה",whatsappLog:"WhatsApp",
    canViewContacts:"צפייה באנשי קשר",canEditContacts:"עריכת אנשי קשר",canDeleteContacts:"מחיקת אנשי קשר",canViewDeals:"צפייה בעסקאות",canEditDeals:"עריכת עסקאות",canDeleteDeals:"מחיקת עסקאות",canViewTasks:"צפייה במשימות",canEditTasks:"עריכת משימות",canViewDashboard:"צפייה בדשבורד",canExportData:"ייצוא",canImportData:"ייבוא",canManageUsers:"ניהול משתמשים",viewOnlyOwn:"רק נתונים שלו",
    newContactAdded:"איש קשר חדש",dealUpdated:"עסקה עודכנה",taskCompleted:"משימה הושלמה",meetingScheduled:"פגישה נקבעה",type:"סוג",business:"עסקי",personal:"פרטי",probability:"הסתברות",
  },
  en:{appName:"Nexus CRM",dashboard:"Dashboard",contacts:"Contacts",deals:"Deals",tasks:"Tasks",admin:"Users",calendar:"Calendar",reports:"Reports",search:"Search...",addContact:"New Contact",addDeal:"New Deal",addTask:"New Task",totalRevenue:"Expected Revenue",activeDeals:"Active Deals",totalContacts:"Total Contacts",pendingTasks:"Pending Tasks",name:"Name",email:"Email",phone:"Phone",company:"Company",status:"Status",value:"Value",stage:"Stage",priority:"Priority",dueDate:"Due Date",description:"Description",save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",lead:"Lead",customer:"Customer",prospect:"Prospect",inactive:"Inactive",qualification:"Qualification",proposal:"Proposal",negotiation:"Negotiation",closed_won:"Won ✓",closed_lost:"Lost ✗",low:"Low",medium:"Medium",high:"High",urgent:"Urgent",todo:"To Do",in_progress:"In Progress",done:"Done",overdue:"Overdue",all:"All",starred:"Starred",address:"Address",notes:"Notes",relatedContact:"Contact",noResults:"No results",closingRate:"Close Rate",avgDealSize:"Avg Deal",revenueOverTime:"Revenue Over Time",dealsByStage:"Deals by Stage",recentActivity:"Recent Activity",topDeals:"Top Deals",monthS:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],monthL:["January","February","March","April","May","June","July","August","September","October","November","December"],dayN:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],importExcel:"Import Excel",importContacts:"Import Contacts",dragDrop:"Drag & drop or click",rowsFound:"rows",mapColumns:"Map Columns",skipFirst:"Skip headers",importBtn:"Import",importing:"Importing...",importedCount:"contacts imported",skip:"Skip",downloadTemplate:"Download Template",addUser:"Add User",role:"Role",permissions:"Permissions",adminRole:"Admin",managerRole:"Manager",salesRole:"Sales",viewerRole:"Viewer",active:"Active",suspended:"Suspended",lastLogin:"Last Login",editPermissions:"Edit Permissions",department:"Department",sales:"Sales",marketing:"Marketing",support:"Support",management:"Management",selectAll:"Select All",deselectAll:"Deselect All",exportExcel:"Export Excel",exportSuccess:"Exported",commLog:"Comm Log",sendEmail:"Send Email",newMeeting:"New Meeting",meetingTitle:"Title",meetingTime:"Time",today:"Today",notifications:"Notifications",markAllRead:"Mark all read",tags:"Tags",advancedSearch:"Filters",clearFilters:"Clear",totalPipeline:"Total Pipeline",weightedValue:"Weighted",emailTemplates:"Templates",useTemplate:"Use",subject:"Subject",message:"Message",timeline:"Timeline",quickActions:"Quick Actions",typeToSearch:"Type to search...",goTo:"Go to",create:"Create",details:"Details",contactDeals:"Deals",contactTasks:"Tasks",contactLog:"Communication",sendWhatsapp:"WhatsApp",addToCalendar:"Add to Calendar",integrations:"Integrations",dragToMove:"Drag to move",pipeline:"Pipeline",summaryReport:"Summary",contactsReport:"Contacts Report",dealsReport:"Deals Report",tasksReport:"Tasks Report",callLog:"Call",emailLog:"Email",meetingLog:"Meeting",noteLog:"Note",whatsappLog:"WhatsApp",
    canViewContacts:"View Contacts",canEditContacts:"Edit Contacts",canDeleteContacts:"Delete Contacts",canViewDeals:"View Deals",canEditDeals:"Edit Deals",canDeleteDeals:"Delete Deals",canViewTasks:"View Tasks",canEditTasks:"Edit Tasks",canViewDashboard:"View Dashboard",canExportData:"Export",canImportData:"Import",canManageUsers:"Manage Users",viewOnlyOwn:"Own data only",
    newContactAdded:"New contact",dealUpdated:"Deal updated",taskCompleted:"Task done",meetingScheduled:"Meeting set",type:"Type",business:"Business",personal:"Personal",probability:"Probability",
  }
};

// ═══ DATA ═══
const defTags=[{id:1,name:"VIP",nameEn:"VIP",color:"#f59e0b"},{id:2,name:"חם",nameEn:"Hot",color:"#ef4444"},{id:3,name:"שותף",nameEn:"Partner",color:"#6366f1"},{id:4,name:"מפנה",nameEn:"Referrer",color:"#22c55e"}];
const initC=[
  {id:1,name:"דניאל כהן",nameEn:"Daniel Cohen",email:"daniel@techco.com",phone:"054-1234567",company:"TechCo",companyEn:"TechCo",status:"customer",starred:true,type:"business",address:"תל אביב",notes:"",tags:[1,2],customFields:{}},
  {id:2,name:"שרה לוי",nameEn:"Sarah Levy",email:"sarah@designhub.io",phone:"052-9876543",company:"DesignHub",companyEn:"DesignHub",status:"lead",starred:false,type:"business",address:"הרצליה",notes:"",tags:[2],customFields:{}},
  {id:3,name:"אמיר חסן",nameEn:"Amir Hassan",email:"amir@globalfin.com",phone:"050-5551234",company:"GlobalFin",companyEn:"GlobalFin",status:"prospect",starred:true,type:"business",address:"חיפה",notes:"",tags:[1,3],customFields:{}},
  {id:4,name:"מיכל ברק",nameEn:"Michal Barak",email:"michal@startup.io",phone:"053-7771234",company:"StartupIO",companyEn:"StartupIO",status:"customer",starred:false,type:"business",address:"רעננה",notes:"",tags:[],customFields:{}},
  {id:5,name:"יוסי גולד",nameEn:"Yossi Gold",email:"yossi@email.com",phone:"058-3334444",company:"",companyEn:"",status:"lead",starred:false,type:"personal",address:"ירושלים",notes:"",tags:[4],customFields:{}},
  {id:6,name:"נועה פרידמן",nameEn:"Noa Friedman",email:"noa@mediaco.com",phone:"054-2223333",company:"MediaCo",companyEn:"MediaCo",status:"customer",starred:true,type:"business",address:"תל אביב",notes:"",tags:[1],customFields:{}},
];
const initD=[
  {id:1,name:"פרויקט אתר",nameEn:"Website Project",contactId:1,value:45000,stage:"proposal",probability:60},
  {id:2,name:"שיווק דיגיטלי",nameEn:"Digital Marketing",contactId:2,value:28000,stage:"qualification",probability:30},
  {id:3,name:"מערכת ERP",nameEn:"ERP System",contactId:3,value:120000,stage:"negotiation",probability:75},
  {id:4,name:"אפליקציית מובייל",nameEn:"Mobile App",contactId:4,value:85000,stage:"proposal",probability:50},
  {id:5,name:"ייעוץ אסטרטגי",nameEn:"Consulting",contactId:6,value:35000,stage:"closed_won",probability:100},
  {id:6,name:"שדרוג תשתיות",nameEn:"Infra Upgrade",contactId:1,value:62000,stage:"qualification",probability:25},
];
const initT=[
  {id:1,title:"להתקשר לדניאל",titleEn:"Call Daniel",contactId:1,priority:"high",status:"todo",dueDate:"2026-02-25",description:""},
  {id:2,title:"שליחת הצעת מחיר",titleEn:"Send proposal",contactId:3,priority:"urgent",status:"in_progress",dueDate:"2026-02-24",description:""},
  {id:3,title:"פגישת דמו",titleEn:"Demo meeting",contactId:4,priority:"medium",status:"todo",dueDate:"2026-02-27",description:""},
  {id:4,title:"מעקב שרה",titleEn:"Follow up Sarah",contactId:2,priority:"low",status:"todo",dueDate:"2026-03-01",description:""},
  {id:5,title:"עדכון חוזה",titleEn:"Update contract",contactId:6,priority:"high",status:"done",dueDate:"2026-02-20",description:""},
];
const initMeet=[
  {id:1,title:"פגישת דמו",titleEn:"Product Demo",contactId:4,date:"2026-02-27",time:"10:00",duration:60,color:"#6366f1"},
  {id:2,title:"סיכום רבעון",titleEn:"Quarter Review",contactId:1,date:"2026-02-28",time:"14:00",duration:90,color:"#22c55e"},
  {id:3,title:"שיחת מכירות",titleEn:"Sales Call",contactId:3,date:"2026-03-02",time:"11:00",duration:30,color:"#f59e0b"},
];
const initLog=[
  {id:1,contactId:1,type:"email",date:"2026-02-24",subject:"הצעת מחיר",subjectEn:"Quote",note:"נשלחה הצעה מעודכנת",noteEn:"Updated quote sent"},
  {id:2,contactId:1,type:"call",date:"2026-02-23",subject:"מעקב",subjectEn:"Follow-up",note:"מעוניין, יחזור בראשון",noteEn:"Interested, will call Sunday"},
  {id:3,contactId:3,type:"meeting",date:"2026-02-22",subject:"פגישת היכרות",subjectEn:"Intro",note:"פגישה מוצלחת",noteEn:"Good meeting"},
  {id:4,contactId:2,type:"whatsapp",date:"2026-02-21",subject:"תזכורת",subjectEn:"Reminder",note:"תזכורת לפגישה",noteEn:"Meeting reminder"},
  {id:5,contactId:6,type:"email",date:"2026-02-20",subject:"חוזה חתום",subjectEn:"Signed",note:"חוזה נחתם",noteEn:"Contract signed"},
];
const initNotif=[
  {id:1,text:"משימה דחופה: הצעת מחיר",textEn:"Urgent: Send proposal",time:"10 דק׳",timeEn:"10m",read:false,color:"#ef4444"},
  {id:2,text:"עסקת ERP עודכנה",textEn:"ERP deal updated",time:"1 שעה",timeEn:"1h",read:false,color:"#f59e0b"},
  {id:3,text:"פגישת דמו מחר 10:00",textEn:"Demo tomorrow 10:00",time:"2 שעות",timeEn:"2h",read:false,color:"#6366f1"},
  {id:4,text:"דניאל כהן עודכן",textEn:"Daniel updated",time:"3 שעות",timeEn:"3h",read:true,color:"#22c55e"},
];
const initUsers=[
  {id:1,name:"אבי מזרחי",nameEn:"Avi Mizrachi",email:"avi@co.com",role:"admin",department:"management",status:"active",lastLogin:"24/02",avatar:"AM",permissions:{canViewContacts:1,canEditContacts:1,canDeleteContacts:1,canViewDeals:1,canEditDeals:1,canDeleteDeals:1,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:1,canImportData:1,canManageUsers:1,viewOnlyOwn:0}},
  {id:2,name:"רונית שפירא",nameEn:"Ronit Shapira",email:"ronit@co.com",role:"manager",department:"sales",status:"active",lastLogin:"24/02",avatar:"RS",permissions:{canViewContacts:1,canEditContacts:1,canDeleteContacts:1,canViewDeals:1,canEditDeals:1,canDeleteDeals:0,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:1,canImportData:1,canManageUsers:0,viewOnlyOwn:0}},
  {id:3,name:"יונתן ברג",nameEn:"Yonatan Berg",email:"yoni@co.com",role:"sales",department:"sales",status:"active",lastLogin:"23/02",avatar:"YB",permissions:{canViewContacts:1,canEditContacts:1,canDeleteContacts:0,canViewDeals:1,canEditDeals:1,canDeleteDeals:0,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:0,canImportData:0,canManageUsers:0,viewOnlyOwn:1}},
  {id:4,name:"עומר דוד",nameEn:"Omer David",email:"omer@co.com",role:"viewer",department:"marketing",status:"suspended",lastLogin:"10/02",avatar:"OD",permissions:{canViewContacts:1,canEditContacts:0,canDeleteContacts:0,canViewDeals:1,canEditDeals:0,canDeleteDeals:0,canViewTasks:1,canEditTasks:0,canViewDashboard:1,canExportData:0,canImportData:0,canManageUsers:0,viewOnlyOwn:1}},
];
const rolePermDefs={admin:{canViewContacts:1,canEditContacts:1,canDeleteContacts:1,canViewDeals:1,canEditDeals:1,canDeleteDeals:1,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:1,canImportData:1,canManageUsers:1,viewOnlyOwn:0},manager:{canViewContacts:1,canEditContacts:1,canDeleteContacts:1,canViewDeals:1,canEditDeals:1,canDeleteDeals:0,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:1,canImportData:1,canManageUsers:0,viewOnlyOwn:0},sales:{canViewContacts:1,canEditContacts:1,canDeleteContacts:0,canViewDeals:1,canEditDeals:1,canDeleteDeals:0,canViewTasks:1,canEditTasks:1,canViewDashboard:1,canExportData:0,canImportData:0,canManageUsers:0,viewOnlyOwn:1},viewer:{canViewContacts:1,canEditContacts:0,canDeleteContacts:0,canViewDeals:1,canEditDeals:0,canDeleteDeals:0,canViewTasks:1,canEditTasks:0,canViewDashboard:1,canExportData:0,canImportData:0,canManageUsers:0,viewOnlyOwn:1}};
const permKeys=["canViewContacts","canEditContacts","canDeleteContacts","canViewDeals","canEditDeals","canDeleteDeals","canViewTasks","canEditTasks","canViewDashboard","canExportData","canImportData","canManageUsers","viewOnlyOwn"];
const revData=[{m:"Jan",v:32},{m:"Feb",v:41},{m:"Mar",v:38},{m:"Apr",v:52},{m:"May",v:47},{m:"Jun",v:58},{m:"Jul",v:63},{m:"Aug",v:55},{m:"Sep",v:72},{m:"Oct",v:68},{m:"Nov",v:78},{m:"Dec",v:85}];
const fmt=v=>"₪"+v.toLocaleString();
const stC={customer:{bg:"#dcfce7",text:"#166534"},lead:{bg:"#dbeafe",text:"#1e40af"},prospect:{bg:"#fef3c7",text:"#92400e"},inactive:{bg:"#f3f4f6",text:"#6b7280"}};
const sgC={qualification:"#818cf8",proposal:"#f59e0b",negotiation:"#f97316",closed_won:"#22c55e",closed_lost:"#ef4444"};
const prC={low:"#94a3b8",medium:"#3b82f6",high:"#f59e0b",urgent:"#ef4444"};
const tsC={todo:"#94a3b8",in_progress:"#3b82f6",done:"#22c55e",overdue:"#ef4444"};
const rlC={admin:{bg:"#fef3c7",text:"#92400e",I:ShieldAlert},manager:{bg:"#dbeafe",text:"#1e40af",I:ShieldCheck},sales:{bg:"#dcfce7",text:"#166534",I:Shield},viewer:{bg:"#f3f4f6",text:"#6b7280",I:Eye}};
const commI={email:Mail,call:Phone,meeting:Video,whatsapp:MessageSquare,note:FileText};
const commC={email:"#3b82f6",call:"#22c55e",meeting:"#8b5cf6",whatsapp:"#25d366",note:"#f59e0b"};

// ═══ Firestore helpers ═══
const FS = {
  save: async (col, id, data) => { try { await setDoc(doc(db, col, String(id)), data); } catch(e) { console.error("FS save:", e); }},
  del: async (col, id) => { try { await deleteDoc(doc(db, col, String(id))); } catch(e) { console.error("FS del:", e); }},
};

// ═══ MAIN ═══
export default function CRM({ currentUser, onLogout }){
  const[lang,setLang]=useState("he");
  const[theme,setTheme]=useState("dark");
  const[tab,setTab]=useState("dashboard");
  const[contacts,setContacts]=useState(initC);
  const[deals,setDeals]=useState(initD);
  const[tasks,setTasks]=useState(initT);
  const[users,setUsers]=useState(initUsers);
  const[meetings,setMeetings]=useState(initMeet);
  const[commLog,setCommLog]=useState(initLog);
  const[notifs,setNotifs]=useState(initNotif);
  const[tags]=useState(defTags);
  const[searchQ,setSearchQ]=useState("");
  const[modal,setModal]=useState(null);
  const[editItem,setEditItem]=useState(null);
  const[cFilter,setCFilter]=useState("all");
  const[tFilter,setTFilter]=useState("all");
  const[anim,setAnim]=useState(false);
  const[toast,setToast]=useState(null);
  const[showNotif,setShowNotif]=useState(false);
  const[showFilters,setShowFilters]=useState(false);
  const[filters,setFilters]=useState({status:"",company:"",tag:""});
  const[calMonth,setCalMonth]=useState(1);
  const[calYear,setCalYear]=useState(2026);
  const[contactDetail,setContactDetail]=useState(null);
  const[profileTab,setProfileTab]=useState("details");
  const[cmdK,setCmdK]=useState(false);
  const[cmdQ,setCmdQ]=useState("");
  const[sideOpen,setSideOpen]=useState(true);
  const[dragDeal,setDragDeal]=useState(null);
  const[dragOver,setDragOver]=useState(null);

  const t=i[lang];const R=lang==="he";const C=themes[theme];
  const ff=R?"'Rubik','Segoe UI',sans-serif":"'DM Sans','Segoe UI',sans-serif";

  // ═══ FIRESTORE SYNC ═══
  const loaded = useRef({contacts:false,deals:false,tasks:false,meetings:false,commLog:false,users:false});
  
  // Real-time listeners - load data from Firestore
  useEffect(() => {
    const unsubs = [];
    const cols = [
      { name:"contacts", setter:setContacts, init:initC },
      { name:"deals", setter:setDeals, init:initD },
      { name:"tasks", setter:setTasks, init:initT },
      { name:"meetings", setter:setMeetings, init:initMeet },
      { name:"commLog", setter:setCommLog, init:initLog },
      { name:"crmUsers", setter:setUsers, init:initUsers },
    ];
    cols.forEach(({ name, setter, init }) => {
      const unsub = onSnapshot(collection(db, name), (snap) => {
        if (snap.empty && !loaded.current[name]) {
          // First time - seed with initial data
          loaded.current[name] = true;
          init.forEach(item => FS.save(name, item.id, item));
        } else if (!snap.empty) {
          loaded.current[name] = true;
          const items = snap.docs.map(d => ({ ...d.data(), id: isNaN(d.id) ? d.id : Number(d.id) }));
          setter(items);
        }
      }, (err) => console.error(`FS listen ${name}:`, err));
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, []);

  // Wrap state setters to also write to Firestore
  const fsSetContacts = (fn) => setContacts(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    // Find added/changed items and deleted items
    next.forEach(item => FS.save("contacts", item.id, item));
    prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => FS.del("contacts", p.id));
    return next;
  });
  const fsSetDeals = (fn) => setDeals(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    next.forEach(item => FS.save("deals", item.id, item));
    prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => FS.del("deals", p.id));
    return next;
  });
  const fsSetTasks = (fn) => setTasks(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    next.forEach(item => FS.save("tasks", item.id, item));
    prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => FS.del("tasks", p.id));
    return next;
  });
  const fsSetMeetings = (fn) => setMeetings(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    next.forEach(item => FS.save("meetings", item.id, item));
    prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => FS.del("meetings", p.id));
    return next;
  });
  const fsSetCommLog = (fn) => setCommLog(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    next.forEach(item => FS.save("commLog", item.id, item));
    return next;
  });
  const fsSetUsers = (fn) => setUsers(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    next.forEach(item => FS.save("crmUsers", item.id, item));
    prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => FS.del("crmUsers", p.id));
    return next;
  });

  useEffect(()=>{setAnim(false);const tm=setTimeout(()=>setAnim(true),50);return()=>clearTimeout(tm)},[tab]);
  useEffect(()=>{const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setCmdK(v=>!v);setCmdQ("")}if(e.key==="Escape"){setCmdK(false);setShowNotif(false)}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000)};
  const cn=id=>{const c=contacts.find(x=>x.id===id);return c?(R?c.name:c.nameEn):""};
  const closeM=()=>{setModal(null);setEditItem(null)};
  const unread=notifs.filter(n=>!n.read).length;

  const stats=useMemo(()=>{
    const ad=deals.filter(d=>!["closed_won","closed_lost"].includes(d.stage));
    const wd=deals.filter(d=>d.stage==="closed_won");
    return{rev:deals.reduce((s,d)=>s+d.value*(d.probability/100),0),ad:ad.length,tc:contacts.length,pt:tasks.filter(t=>t.status!=="done").length,cr:deals.length?Math.round(wd.length/deals.length*100):0,avg:deals.length?Math.round(deals.reduce((s,d)=>s+d.value,0)/deals.length):0,tp:ad.reduce((s,d)=>s+d.value,0),wp:ad.reduce((s,d)=>s+d.value*(d.probability/100),0)};
  },[contacts,deals,tasks]);

  const exportXL=(data,name)=>{const ws=XLSX.utils.json_to_sheet(data);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,name);XLSX.writeFile(wb,`${name}.xlsx`);showToast(t.exportSuccess)};

  // ═══ UI PRIMITIVES ═══
  const Badge=({color:cl,children:ch,style:s={}})=><span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:600,background:cl.bg||cl,color:cl.text||"#fff",letterSpacing:.3,...s}}>{ch}</span>;
  
  const Stat=({icon:Ic,label:lb,value:vl,color:cl,trend:tr})=>(
    <div style={{background:C.surface,borderRadius:16,padding:"18px 20px",border:`1px solid ${C.border}`,flex:1,minWidth:150,position:"relative",overflow:"hidden",boxShadow:C.cardShadow,transition:"all .3s"}}>
      <div style={{position:"absolute",top:0,[R?"right":"left"]:0,width:3,height:"100%",background:cl}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{background:`${cl}14`,borderRadius:10,padding:7,display:"flex"}}><Ic size={16} color={cl}/></div>
        {tr!==undefined&&<div style={{display:"flex",alignItems:"center",gap:2,fontSize:11,color:tr>=0?C.ok:C.danger}}>{tr>=0?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>}{Math.abs(tr)}%</div>}
      </div>
      <div style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{vl}</div>
      <div style={{fontSize:11,color:C.textM,fontWeight:500}}>{lb}</div>
    </div>
  );

  const IBtn=({icon:Ic,onClick:oc,active:ac,size:sz=17,style:s={}})=><button onClick={oc} style={{background:ac?C.accentS:"transparent",border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:ac?C.accent:C.textM,transition:"all .15s",...s}} onMouseEnter={e=>{if(!ac)e.currentTarget.style.background=C.surfaceH}} onMouseLeave={e=>{e.currentTarget.style.background=ac?C.accentS:"transparent"}}><Ic size={sz}/></button>;

  const Modal_=({title:ti,children:ch,onClose:oc,width:w=480})=>(
    <div style={{position:"fixed",inset:0,background:C.modalBg,backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,animation:"fadeIn .15s"}} onClick={oc}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:"24px 28px",width:"92%",maxWidth:w,maxHeight:"85vh",overflowY:"auto",animation:"slideUp .25s",direction:R?"rtl":"ltr",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.text}}>{ti}</h3><IBtn icon={X} onClick={oc}/></div>{ch}
      </div>
    </div>
  );

  const FF=({label:lb,children:ch})=><div style={{marginBottom:14}}><label style={{display:"block",fontSize:10,fontWeight:600,color:C.textM,marginBottom:5,letterSpacing:.4,textTransform:"uppercase"}}>{lb}</label>{ch}</div>;
  const iS={width:"100%",padding:"9px 13px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,fontFamily:ff,outline:"none",boxSizing:"border-box",direction:R?"rtl":"ltr",transition:"border .2s"};
  const sS={...iS,cursor:"pointer"};
  const bP={padding:"9px 20px",borderRadius:10,border:"none",background:C.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:ff,transition:"all .2s"};
  const bS={...bP,background:"transparent",border:`1px solid ${C.border}`,color:C.textM};

  // ═══ CMD+K PALETTE ═══
  const CmdKPalette=()=>{
    const q=cmdQ.toLowerCase();
    const navResults=[
      {label:t.dashboard,icon:BarChart3,action:()=>{setTab("dashboard");setCmdK(false)}},
      {label:t.contacts,icon:Users,action:()=>{setTab("contacts");setCmdK(false)}},
      {label:t.deals,icon:Briefcase,action:()=>{setTab("deals");setCmdK(false)}},
      {label:t.tasks,icon:ListTodo,action:()=>{setTab("tasks");setCmdK(false)}},
      {label:t.calendar,icon:Calendar,action:()=>{setTab("calendar");setCmdK(false)}},
      {label:t.reports,icon:FileText,action:()=>{setTab("reports");setCmdK(false)}},
    ];
    const createResults=[
      {label:t.addContact,icon:Users,action:()=>{setModal("contact");setCmdK(false)}},
      {label:t.addDeal,icon:Briefcase,action:()=>{setModal("deal");setCmdK(false)}},
      {label:t.addTask,icon:ListTodo,action:()=>{setModal("task");setCmdK(false)}},
      {label:t.newMeeting,icon:Calendar,action:()=>{setModal("meeting");setCmdK(false)}},
    ];
    const contactResults=contacts.filter(c=>!q||c.name.includes(q)||c.nameEn.toLowerCase().includes(q)||c.email.includes(q)).slice(0,5).map(c=>({label:R?c.name:c.nameEn,sublabel:c.email,icon:User,action:()=>{setContactDetail(c.id);setCmdK(false)}}));
    const dealResults=deals.filter(d=>!q||d.name.includes(q)||d.nameEn.toLowerCase().includes(q)).slice(0,3).map(d=>({label:R?d.name:d.nameEn,sublabel:fmt(d.value),icon:Briefcase,action:()=>{setTab("deals");setCmdK(false)}}));

    const filtered=[
      ...(!q?[]:contactResults),
      ...(!q?[]:dealResults),
      ...(q?navResults.filter(r=>r.label.toLowerCase().includes(q)):navResults),
      ...(!q?createResults:createResults.filter(r=>r.label.toLowerCase().includes(q))),
    ];

    return(
      <div style={{position:"fixed",inset:0,background:C.modalBg,backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"15vh",zIndex:2000}} onClick={()=>setCmdK(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"90%",maxWidth:520,background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.4)",animation:"slideUp .2s"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}>
            <Command size={18} color={C.textM}/>
            <input autoFocus value={cmdQ} onChange={e=>setCmdQ(e.target.value)} placeholder={t.typeToSearch} style={{flex:1,background:"transparent",border:"none",outline:"none",color:C.text,fontSize:15,fontFamily:ff}} dir={R?"rtl":"ltr"}/>
            <kbd style={{padding:"2px 8px",borderRadius:6,background:C.bg,color:C.textD,fontSize:10,border:`1px solid ${C.border}`}}>ESC</kbd>
          </div>
          <div style={{maxHeight:360,overflowY:"auto",padding:6}}>
            {!q&&<div style={{padding:"8px 12px",fontSize:10,fontWeight:600,color:C.textD,letterSpacing:.5}}>{t.goTo}</div>}
            {filtered.map((r,idx)=>(
              <button key={idx} onClick={r.action} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",color:C.text,fontFamily:ff,fontSize:13,textAlign:R?"right":"left",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <r.icon size={16} color={C.textM}/>
                <span style={{flex:1}}>{r.label}</span>
                {r.sublabel&&<span style={{fontSize:11,color:C.textD}}>{r.sublabel}</span>}
                <ArrowRight size={14} color={C.textD}/>
              </button>
            ))}
            {filtered.length===0&&<div style={{padding:24,textAlign:"center",color:C.textD}}>{t.noResults}</div>}
          </div>
        </div>
      </div>
    );
  };

  // ═══ CONTACT MODAL ═══
  const ContactModal_=()=>{
    const[f,sF]=useState(editItem||{name:"",nameEn:"",email:"",phone:"",company:"",companyEn:"",status:"lead",starred:false,type:"business",address:"",notes:"",tags:[],customFields:{}});
    const save=()=>{if(editItem)fsSetContacts(cs=>cs.map(c=>c.id===editItem.id?{...f}:c));else fsSetContacts(cs=>[...cs,{...f,id:Date.now()}]);closeM()};
    return(<Modal_ title={editItem?t.edit:t.addContact} onClose={closeM} width={500}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.name+" (HE)"}><input style={iS} value={f.name} onChange={e=>sF({...f,name:e.target.value})}/></FF>
        <FF label={t.name+" (EN)"}><input style={iS} value={f.nameEn} onChange={e=>sF({...f,nameEn:e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.email}><input style={iS} value={f.email} onChange={e=>sF({...f,email:e.target.value})} dir="ltr"/></FF>
        <FF label={t.phone}><input style={iS} value={f.phone} onChange={e=>sF({...f,phone:e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.company}><input style={iS} value={f.company} onChange={e=>sF({...f,company:e.target.value})}/></FF>
        <FF label={t.status}><select style={sS} value={f.status} onChange={e=>sF({...f,status:e.target.value})}>{["lead","prospect","customer","inactive"].map(s=><option key={s} value={s}>{t[s]}</option>)}</select></FF>
      </div>
      <FF label={t.tags}><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{tags.map(tg=><button key={tg.id} onClick={()=>sF({...f,tags:f.tags.includes(tg.id)?f.tags.filter(x=>x!==tg.id):[...f.tags,tg.id]})} style={{padding:"3px 11px",borderRadius:12,border:`1px solid ${f.tags.includes(tg.id)?tg.color:C.border}`,background:f.tags.includes(tg.id)?tg.color+"20":"transparent",color:f.tags.includes(tg.id)?tg.color:C.textM,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:ff,transition:"all .2s"}}>{R?tg.name:tg.nameEn}</button>)}</div></FF>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ DEAL MODAL ═══
  const DealModal_=()=>{
    const[f,sF]=useState(editItem||{name:"",nameEn:"",contactId:contacts[0]?.id||0,value:0,stage:"qualification",probability:25});
    const save=()=>{if(editItem)fsSetDeals(ds=>ds.map(d=>d.id===editItem.id?{...f}:d));else fsSetDeals(ds=>[...ds,{...f,id:Date.now()}]);closeM()};
    return(<Modal_ title={editItem?t.edit:t.addDeal} onClose={closeM}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.name+" (HE)"}><input style={iS} value={f.name} onChange={e=>sF({...f,name:e.target.value})}/></FF>
        <FF label={t.name+" (EN)"}><input style={iS} value={f.nameEn} onChange={e=>sF({...f,nameEn:e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.value+" (₪)"}><input style={iS} type="number" value={f.value} onChange={e=>sF({...f,value:+e.target.value})} dir="ltr"/></FF>
        <FF label={t.relatedContact}><select style={sS} value={f.contactId} onChange={e=>sF({...f,contactId:+e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{R?c.name:c.nameEn}</option>)}</select></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.stage}><select style={sS} value={f.stage} onChange={e=>sF({...f,stage:e.target.value})}>{["qualification","proposal","negotiation","closed_won","closed_lost"].map(s=><option key={s} value={s}>{t[s]}</option>)}</select></FF>
        <FF label={t.probability+"%"}><input style={iS} type="number" min="0" max="100" value={f.probability} onChange={e=>sF({...f,probability:+e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ TASK MODAL ═══
  const TaskModal_=()=>{
    const[f,sF]=useState(editItem||{title:"",titleEn:"",contactId:contacts[0]?.id||0,priority:"medium",status:"todo",dueDate:"2026-02-28",description:""});
    const save=()=>{if(editItem)fsSetTasks(ts=>ts.map(x=>x.id===editItem.id?{...f}:x));else fsSetTasks(ts=>[...ts,{...f,id:Date.now()}]);closeM()};
    return(<Modal_ title={editItem?t.edit:t.addTask} onClose={closeM}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.name+" (HE)"}><input style={iS} value={f.title} onChange={e=>sF({...f,title:e.target.value})}/></FF>
        <FF label={t.name+" (EN)"}><input style={iS} value={f.titleEn} onChange={e=>sF({...f,titleEn:e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <FF label={t.priority}><select style={sS} value={f.priority} onChange={e=>sF({...f,priority:e.target.value})}>{["low","medium","high","urgent"].map(p=><option key={p} value={p}>{t[p]}</option>)}</select></FF>
        <FF label={t.dueDate}><input style={iS} type="date" value={f.dueDate} onChange={e=>sF({...f,dueDate:e.target.value})} dir="ltr"/></FF>
        <FF label={t.relatedContact}><select style={sS} value={f.contactId} onChange={e=>sF({...f,contactId:+e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{R?c.name:c.nameEn}</option>)}</select></FF>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ MEETING MODAL ═══
  const MeetingModal_=()=>{
    const[f,sF]=useState(editItem||{title:"",titleEn:"",contactId:0,date:"2026-02-28",time:"10:00",duration:60,color:"#6366f1"});
    const save=()=>{if(editItem)fsSetMeetings(ms=>ms.map(m=>m.id===editItem.id?{...f}:m));else fsSetMeetings(ms=>[...ms,{...f,id:Date.now()}]);closeM();showToast(t.meetingScheduled)};
    return(<Modal_ title={editItem?t.edit:t.newMeeting} onClose={closeM}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.meetingTitle+" (HE)"}><input style={iS} value={f.title} onChange={e=>sF({...f,title:e.target.value})}/></FF>
        <FF label={t.meetingTitle+" (EN)"}><input style={iS} value={f.titleEn} onChange={e=>sF({...f,titleEn:e.target.value})} dir="ltr"/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <FF label="Date"><input style={iS} type="date" value={f.date} onChange={e=>sF({...f,date:e.target.value})} dir="ltr"/></FF>
        <FF label={t.meetingTime}><input style={iS} type="time" value={f.time} onChange={e=>sF({...f,time:e.target.value})} dir="ltr"/></FF>
        <FF label="Min"><input style={iS} type="number" value={f.duration} onChange={e=>sF({...f,duration:+e.target.value})} dir="ltr"/></FF>
      </div>
      <FF label={t.relatedContact}><select style={sS} value={f.contactId} onChange={e=>sF({...f,contactId:+e.target.value})}><option value={0}>—</option>{contacts.map(c=><option key={c.id} value={c.id}>{R?c.name:c.nameEn}</option>)}</select></FF>
      <FF label="Color"><div style={{display:"flex",gap:5}}>{["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"].map(cl=><button key={cl} onClick={()=>sF({...f,color:cl})} style={{width:26,height:26,borderRadius:8,background:cl,border:f.color===cl?"3px solid "+C.text:"2px solid transparent",cursor:"pointer"}}/>)}</div></FF>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ USER MODAL ═══
  const UserModal_=()=>{
    const[f,sF]=useState(editItem||{name:"",nameEn:"",email:"",role:"sales",department:"sales",status:"active",lastLogin:"-",permissions:{...rolePermDefs.sales},avatar:""});
    const save=()=>{const av=(f.nameEn||f.name).split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);if(editItem)fsSetUsers(us=>us.map(u=>u.id===editItem.id?{...f,avatar:av}:u));else fsSetUsers(us=>[...us,{...f,id:Date.now(),avatar:av}]);closeM()};
    return(<Modal_ title={editItem?t.editPermissions:t.addUser} onClose={closeM} width={540}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.name+" (HE)"}><input style={iS} value={f.name} onChange={e=>sF({...f,name:e.target.value})}/></FF>
        <FF label={t.name+" (EN)"}><input style={iS} value={f.nameEn} onChange={e=>sF({...f,nameEn:e.target.value})} dir="ltr"/></FF>
      </div>
      <FF label={t.email}><input style={iS} type="email" value={f.email} onChange={e=>sF({...f,email:e.target.value})} dir="ltr"/></FF>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.role}><select style={sS} value={f.role} onChange={e=>{const r=e.target.value;sF({...f,role:r,permissions:{...rolePermDefs[r]}})}}>{["admin","manager","sales","viewer"].map(r=><option key={r} value={r}>{t[r+"Role"]}</option>)}</select></FF>
        <FF label={t.department}><select style={sS} value={f.department} onChange={e=>sF({...f,department:e.target.value})}>{["sales","marketing","support","management"].map(d=><option key={d} value={d}>{t[d]}</option>)}</select></FF>
      </div>
      <div style={{marginTop:4,marginBottom:14}}>
        <h4 style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:8}}>{t.permissions}</h4>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>{permKeys.map(k=><label key={k} onClick={()=>sF({...f,permissions:{...f.permissions,[k]:f.permissions[k]?0:1}})} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:7,cursor:"pointer",background:f.permissions[k]?`${C.ok}10`:C.bg,border:`1px solid ${f.permissions[k]?C.ok+"40":C.border}`,transition:"all .15s"}}><div style={{width:15,height:15,borderRadius:3,border:`2px solid ${f.permissions[k]?C.ok:C.border}`,background:f.permissions[k]?C.ok:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{f.permissions[k]?<Check size={9} color="#fff"/>:null}</div><span style={{fontSize:10,color:f.permissions[k]?C.text:C.textM}}>{t[k]}</span></label>)}</div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ COMM LOG MODAL ═══
  const CommLogModal_=()=>{
    const[f,sF]=useState({contactId:editItem||contacts[0]?.id||0,type:"email",subject:"",note:"",date:new Date().toISOString().split("T")[0]});
    const save=()=>{fsSetCommLog(cl=>[{id:Date.now(),subjectEn:f.subject,noteEn:f.note,...f},...cl]);closeM();showToast(t.save)};
    return(<Modal_ title={t.commLog} onClose={closeM}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label={t.type}><select style={sS} value={f.type} onChange={e=>sF({...f,type:e.target.value})}>{["email","call","meeting","whatsapp","note"].map(tp=><option key={tp} value={tp}>{t[tp+"Log"]}</option>)}</select></FF>
        <FF label={t.relatedContact}><select style={sS} value={f.contactId} onChange={e=>sF({...f,contactId:+e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{R?c.name:c.nameEn}</option>)}</select></FF>
      </div>
      <FF label={t.subject}><input style={iS} value={f.subject} onChange={e=>sF({...f,subject:e.target.value})}/></FF>
      <FF label={t.message}><textarea style={{...iS,minHeight:60,resize:"vertical"}} value={f.note} onChange={e=>sF({...f,note:e.target.value})}/></FF>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}}><button style={bS} onClick={closeM}>{t.cancel}</button><button style={bP} onClick={save}>{t.save}</button></div>
    </Modal_>);
  };

  // ═══ IMPORT MODAL ═══
  const ImportModal_=()=>{
    const[step,setStep]=useState("upload");const[drag,setDrag_]=useState(false);const[fname,setFname]=useState("");const[raw,setRaw]=useState([]);const[hdrs,setHdrs]=useState([]);const[map,setMap]=useState({});const[skip,setSkip_]=useState(true);const[imp,setImp]=useState(false);const fr=useRef(null);
    const tfs=[{key:"—",label:"—"},{key:"name",label:t.name+" HE"},{key:"nameEn",label:t.name+" EN"},{key:"email",label:t.email},{key:"phone",label:t.phone},{key:"company",label:t.company},{key:"address",label:t.address}];
    const proc=file=>{setFname(file.name);const r=new FileReader();r.onload=e=>{try{const d=new Uint8Array(e.target.result);const wb=XLSX.read(d,{type:"array"});const sh=wb.Sheets[wb.SheetNames[0]];const j=XLSX.utils.sheet_to_json(sh,{header:1});if(j.length){setRaw(j);const h=j[0].map(String);setHdrs(h);const am={};h.forEach((v,idx)=>{const l=v.toLowerCase();if(l.includes("שם")||l.includes("name"))am[idx]=l.includes("en")?"nameEn":"name";else if(l.includes("mail")||l.includes("מייל"))am[idx]="email";else if(l.includes("phone")||l.includes("טלפון"))am[idx]="phone";else if(l.includes("company")||l.includes("חברה"))am[idx]="company"});setMap(am);setStep("mapping")}}catch{showToast("Error","error")}};r.readAsArrayBuffer(file)};
    const rows=skip?raw.slice(1):raw;
    const doImp=()=>{setImp(true);setTimeout(()=>{const nc=rows.filter(r=>r.some(c=>c)).map((r,idx)=>{const c={id:Date.now()+idx,name:"",nameEn:"",email:"",phone:"",company:"",companyEn:"",status:"lead",starred:false,type:"business",address:"",notes:"",tags:[],customFields:{}};Object.entries(map).forEach(([ci,f])=>{if(f&&f!=="—"&&r[ci]!=null)c[f]=String(r[ci])});if(!c.name&&c.nameEn)c.name=c.nameEn;if(!c.nameEn&&c.name)c.nameEn=c.name;return c}).filter(c=>c.name||c.email);fsSetContacts(p=>[...p,...nc]);setImp(false);showToast(`${nc.length} ${t.importedCount}`);setModal(null)},400)};
    return(<Modal_ title={t.importContacts} onClose={()=>setModal(null)} width={580}>
      {step==="upload"&&<div onDragOver={e=>{e.preventDefault();setDrag_(true)}} onDragLeave={()=>setDrag_(false)} onDrop={e=>{e.preventDefault();setDrag_(false);if(e.dataTransfer.files[0])proc(e.dataTransfer.files[0])}} onClick={()=>fr.current?.click()} style={{border:`2px dashed ${drag?C.accent:C.border}`,borderRadius:16,padding:"40px 24px",textAlign:"center",cursor:"pointer",background:drag?C.accentS:C.bg,transition:"all .3s"}}>
        <input ref={fr} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>e.target.files[0]&&proc(e.target.files[0])}/>
        <FileSpreadsheet size={32} color={C.accent} style={{marginBottom:12}}/>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:6}}>{t.dragDrop}</div>
        <div style={{fontSize:11,color:C.textD}}>{".xlsx, .xls, .csv"}</div>
      </div>}
      {step==="mapping"&&<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"8px 12px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}><FileSpreadsheet size={15} color={C.accent}/><span style={{fontSize:12,color:C.text,flex:1}}>{fname}</span><Badge color={{bg:`${C.ok}20`,text:C.ok}}>{rows.length} {t.rowsFound}</Badge></div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>{hdrs.map((h,idx)=><div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 20px 1fr",gap:8,alignItems:"center"}}><div style={{padding:"6px 10px",background:C.bg,borderRadius:7,fontSize:11,color:C.text,border:`1px solid ${C.border}`,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h}</div><ChevronRight size={13} color={C.textD} style={{transform:R?"rotate(180deg)":"none"}}/><select style={{...sS,padding:"6px 10px",fontSize:11}} value={map[idx]||"—"} onChange={e=>setMap({...map,[idx]:e.target.value})}>{tfs.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select></div>)}</div>
        <label style={{display:"flex",alignItems:"center",gap:7,fontSize:11,color:C.textM,cursor:"pointer",marginBottom:16}}><input type="checkbox" checked={skip} onChange={e=>setSkip_(e.target.checked)} style={{accentColor:C.accent}}/>{t.skipFirst}</label>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button style={bS} onClick={()=>setStep("upload")}>{t.cancel}</button><button style={bP} onClick={doImp} disabled={imp}>{imp?t.importing:`${t.importBtn} (${rows.length})`}</button></div>
      </div>}
    </Modal_>);
  };

  // ═══ CONTACT PROFILE (Full page with tabs) ═══
  const ContactProfile_=()=>{
    const c=contacts.find(x=>x.id===contactDetail);if(!c)return null;
    const cD=deals.filter(d=>d.contactId===c.id);
    const cT=tasks.filter(tk=>tk.contactId===c.id);
    const cL=commLog.filter(l=>l.contactId===c.id);
    const cM=meetings.filter(m=>m.contactId===c.id);
    const cTags=tags.filter(tg=>c.tags.includes(tg.id));
    const ptabs=[{key:"details",label:t.details,icon:User},{key:"deals",label:t.contactDeals,icon:Briefcase},{key:"tasks",label:t.contactTasks,icon:ListTodo},{key:"log",label:t.contactLog,icon:Activity}];
    return(
      <Modal_ title="" onClose={()=>{setContactDetail(null);setProfileTab("details")}} width={700}>
        {/* Profile Header */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:"20px 24px",background:C.bg,borderRadius:16,border:`1px solid ${C.border}`}}>
          <div style={{width:64,height:64,borderRadius:16,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:26,flexShrink:0}}>{(R?c.name:c.nameEn).charAt(0)}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:20,fontWeight:700,color:C.text}}>{R?c.name:c.nameEn}</span>
              {c.starred&&<Star size={16} color="#f59e0b" fill="#f59e0b"/>}
              <Badge color={stC[c.status]}>{t[c.status]}</Badge>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14,fontSize:12,color:C.textM,flexWrap:"wrap"}}>
              {c.company&&<span style={{display:"flex",alignItems:"center",gap:3}}><Building2 size={12}/>{R?c.company:c.companyEn}</span>}
              <span style={{display:"flex",alignItems:"center",gap:3}}><Mail size={12}/>{c.email}</span>
              <span style={{display:"flex",alignItems:"center",gap:3}}><Phone size={12}/>{c.phone}</span>
            </div>
            <div style={{display:"flex",gap:4,marginTop:6}}>{cTags.map(tg=><span key={tg.id} style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600,background:tg.color+"20",color:tg.color}}>{R?tg.name:tg.nameEn}</span>)}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button style={{...bS,padding:"6px 14px",fontSize:11,display:"flex",alignItems:"center",gap:5}} onClick={()=>{showToast(t.sendWhatsapp);setContactDetail(null)}}><MessageSquare size={13} color="#25d366"/>WhatsApp</button>
            <button style={{...bS,padding:"6px 14px",fontSize:11,display:"flex",alignItems:"center",gap:5}} onClick={()=>{setContactDetail(null);setModal("commlog")}}><Mail size={13} color="#3b82f6"/>{t.sendEmail}</button>
          </div>
        </div>
        {/* Stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:20}}>
          <div style={{padding:"12px",background:C.bg,borderRadius:10,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:700,color:C.accent}}>{cD.length}</div><div style={{fontSize:10,color:C.textM}}>{t.deals}</div></div>
          <div style={{padding:"12px",background:C.bg,borderRadius:10,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:700,color:C.ok}}>{fmt(cD.reduce((s,d)=>s+d.value,0))}</div><div style={{fontSize:10,color:C.textM}}>{t.value}</div></div>
          <div style={{padding:"12px",background:C.bg,borderRadius:10,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:700,color:C.warn}}>{cT.filter(t=>t.status!=="done").length}</div><div style={{fontSize:10,color:C.textM}}>{t.tasks}</div></div>
          <div style={{padding:"12px",background:C.bg,borderRadius:10,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:700,color:"#8b5cf6"}}>{cL.length}</div><div style={{fontSize:10,color:C.textM}}>{t.commLog}</div></div>
        </div>
        {/* Tab bar */}
        <div style={{display:"flex",gap:3,marginBottom:16,background:C.bg,borderRadius:10,padding:3}}>
          {ptabs.map(pt=><button key={pt.key} onClick={()=>setProfileTab(pt.key)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"8px",borderRadius:8,border:"none",background:profileTab===pt.key?C.surface:"transparent",color:profileTab===pt.key?C.accent:C.textM,fontSize:12,fontWeight:profileTab===pt.key?600:500,cursor:"pointer",fontFamily:ff,transition:"all .2s",boxShadow:profileTab===pt.key?C.cardShadow:"none"}}><pt.icon size={14}/>{pt.label}</button>)}
        </div>
        {/* Tab content */}
        <div style={{maxHeight:300,overflowY:"auto"}}>
          {profileTab==="details"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:t.name,v:R?c.name:c.nameEn},{l:t.email,v:c.email},{l:t.phone,v:c.phone},{l:t.company,v:R?c.company:c.companyEn},{l:t.address,v:c.address},{l:t.type,v:t[c.type]}].map((r,idx)=><div key={idx} style={{padding:"10px 14px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}><div style={{fontSize:10,color:C.textD,marginBottom:3}}>{r.l}</div><div style={{fontSize:13,color:C.text,fontWeight:500}}>{r.v||"—"}</div></div>)}
          </div>}
          {profileTab==="deals"&&<div style={{display:"flex",flexDirection:"column",gap:7}}>
            {cD.length===0?<div style={{textAlign:"center",padding:30,color:C.textD}}>{t.noResults}</div>:cD.map(d=>(
              <div key={d.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`,borderInlineStart:`3px solid ${sgC[d.stage]}`}}>
                <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{R?d.name:d.nameEn}</div><Badge color={{bg:`${sgC[d.stage]}20`,text:sgC[d.stage]}} style={{marginTop:4}}>{t[d.stage]}</Badge></div>
                <div style={{textAlign:R?"left":"right"}}><div style={{fontSize:16,fontWeight:700,color:C.accent}}>{fmt(d.value)}</div><div style={{fontSize:11,color:C.textM}}>{d.probability}%</div></div>
              </div>
            ))}
          </div>}
          {profileTab==="tasks"&&<div style={{display:"flex",flexDirection:"column",gap:7}}>
            {cT.length===0?<div style={{textAlign:"center",padding:30,color:C.textD}}>{t.noResults}</div>:cT.map(tk=>(
              <div key={tk.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{width:8,height:8,borderRadius:4,background:prC[tk.priority],flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontSize:13,color:tk.status==="done"?C.textD:C.text,textDecoration:tk.status==="done"?"line-through":"none"}}>{R?tk.title:tk.titleEn}</div><div style={{fontSize:11,color:C.textD}}>{tk.dueDate}</div></div>
                <Badge color={{bg:`${tsC[tk.status]}20`,text:tsC[tk.status]}}>{t[tk.status]}</Badge>
              </div>
            ))}
          </div>}
          {profileTab==="log"&&<div style={{display:"flex",flexDirection:"column",gap:7}}>
            {cL.length===0?<div style={{textAlign:"center",padding:30,color:C.textD}}>{t.noResults}</div>:cL.map(l=>{const Ic=commI[l.type]||FileText;const cl=commC[l.type];return(
              <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{background:`${cl}18`,borderRadius:8,padding:6,display:"flex",marginTop:2}}><Ic size={14} color={cl}/></div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{R?l.subject:l.subjectEn}</div><div style={{fontSize:11,color:C.textM,marginTop:2}}>{R?l.note:l.noteEn}</div></div>
                <span style={{fontSize:10,color:C.textD}}>{l.date}</span>
              </div>
            )})}
          </div>}
        </div>
      </Modal_>
    );
  };

  // ═══ VIEWS ═══
  
  // DASHBOARD with Recharts
  const DashboardV=()=>{
    const stageData=["qualification","proposal","negotiation","closed_won","closed_lost"].map(k=>({name:t[k],value:deals.filter(d=>d.stage===k).length,color:sgC[k]}));
    const statusData=["customer","lead","prospect","inactive"].map(k=>({name:t[k],value:contacts.filter(c=>c.status===k).length,color:stC[k].text}));
    const acts=[{icon:Users,text:t.newContactAdded,time:"2h",color:"#6366f1"},{icon:TrendingUp,text:t.dealUpdated,time:"4h",color:"#22c55e"},{icon:CheckCircle2,text:t.taskCompleted,time:"6h",color:"#f59e0b"},{icon:Calendar,text:t.meetingScheduled,time:"1d",color:"#8b5cf6"}];
    const topD=[...deals].sort((a,b)=>b.value-a.value).slice(0,4);
    const chartData=revData.map((d,idx)=>({name:t.monthS[idx],value:d.v}));
    return(
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Stat icon={DollarSign} label={t.totalRevenue} value={fmt(Math.round(stats.rev))} color="#6366f1" trend={12}/>
          <Stat icon={Briefcase} label={t.activeDeals} value={stats.ad} color="#f59e0b" trend={8}/>
          <Stat icon={Users} label={t.totalContacts} value={stats.tc} color="#22c55e" trend={5}/>
          <Stat icon={ListTodo} label={t.pendingTasks} value={stats.pt} color="#ef4444" trend={-3}/>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Stat icon={Target} label={t.closingRate} value={stats.cr+"%"} color="#8b5cf6"/>
          <Stat icon={BarChart3} label={t.avgDealSize} value={fmt(stats.avg)} color="#06b6d4"/>
          <Stat icon={TrendingUp} label={t.totalPipeline} value={fmt(stats.tp)} color="#ec4899"/>
          <Stat icon={DollarSign} label={t.weightedValue} value={fmt(Math.round(stats.wp))} color="#f97316"/>
        </div>
        {/* Charts */}
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
          <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:C.text}}>{t.revenueOverTime}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={.3}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="name" tick={{fontSize:10,fill:C.textD}} stroke={C.border}/>
                <YAxis tick={{fontSize:10,fill:C.textD}} stroke={C.border}/>
                <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,color:C.text}} cursor={{stroke:C.accent,strokeDasharray:"4 4"}}/>
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad1)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:600,color:C.text}}>{t.dealsByStage}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={stageData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">{stageData.map((e,idx)=><Cell key={idx} fill={e.color}/>)}</Pie>
                <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,color:C.text}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
            <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:600,color:C.text}}>{t.recentActivity}</h3>
            {acts.map((a,idx)=><div key={idx} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}><div style={{background:`${a.color}14`,borderRadius:9,padding:7,display:"flex"}}><a.icon size={14} color={a.color}/></div><div style={{flex:1,fontSize:12,color:C.text}}>{a.text}</div><span style={{fontSize:10,color:C.textD}}>{a.time}</span></div>)}
          </div>
          <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
            <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:600,color:C.text}}>{t.topDeals}</h3>
            {topD.map(d=><div key={d.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:6,cursor:"pointer"}} onClick={()=>{setContactDetail(d.contactId)}}><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{R?d.name:d.nameEn}</div><div style={{fontSize:10,color:C.textM,display:"flex",alignItems:"center",gap:3}}><Link2 size={10}/>{cn(d.contactId)}</div></div><div style={{textAlign:R?"left":"right"}}><div style={{fontSize:13,fontWeight:700,color:C.accent}}>{fmt(d.value)}</div><Badge color={{bg:`${sgC[d.stage]}20`,text:sgC[d.stage]}}>{t[d.stage]}</Badge></div></div>)}
          </div>
        </div>
      </div>
    );
  };

  // CONTACTS
  const ContactsV=()=>{
    const fd=contacts.filter(c=>{const q=searchQ.toLowerCase();return(!q||c.name.includes(q)||c.nameEn.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||c.company.includes(q))&&(cFilter==="all"||(cFilter==="starred"&&c.starred)||c.status===cFilter)&&(!filters.status||c.status===filters.status)&&(!filters.company||c.company.includes(filters.company)||c.companyEn?.toLowerCase().includes(filters.company.toLowerCase()))&&(!filters.tag||c.tags.includes(+filters.tag))});
    return(<div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {["all","starred","lead","prospect","customer","inactive"].map(f=><button key={f} onClick={()=>setCFilter(f)} style={{padding:"5px 13px",borderRadius:20,border:`1px solid ${cFilter===f?C.accent:C.border}`,background:cFilter===f?C.accentS:"transparent",color:cFilter===f?C.accent:C.textM,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:ff,transition:"all .15s"}}>{f==="starred"?"⭐ ":""}{t[f]}</button>)}
        <button onClick={()=>setShowFilters(!showFilters)} style={{...bS,padding:"5px 12px",fontSize:10,display:"flex",alignItems:"center",gap:4,marginInlineStart:"auto"}}><Filter size={12}/>{t.advancedSearch}</button>
      </div>
      {showFilters&&<div style={{display:"flex",gap:8,marginBottom:14,padding:"12px 16px",background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,flexWrap:"wrap",alignItems:"flex-end"}}>
        <div><label style={{fontSize:9,color:C.textM,display:"block",marginBottom:3}}>{t.status}</label><select style={{...sS,width:110,padding:"5px 8px",fontSize:11}} value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">{t.all}</option>{["lead","prospect","customer","inactive"].map(s=><option key={s} value={s}>{t[s]}</option>)}</select></div>
        <div><label style={{fontSize:9,color:C.textM,display:"block",marginBottom:3}}>{t.company}</label><input style={{...iS,width:120,padding:"5px 8px",fontSize:11}} value={filters.company} onChange={e=>setFilters({...filters,company:e.target.value})}/></div>
        <div><label style={{fontSize:9,color:C.textM,display:"block",marginBottom:3}}>{t.tags}</label><select style={{...sS,width:110,padding:"5px 8px",fontSize:11}} value={filters.tag} onChange={e=>setFilters({...filters,tag:e.target.value})}><option value="">{t.all}</option>{tags.map(tg=><option key={tg.id} value={tg.id}>{R?tg.name:tg.nameEn}</option>)}</select></div>
        <button onClick={()=>setFilters({status:"",company:"",tag:""})} style={{...bS,padding:"5px 10px",fontSize:10}}>{t.clearFilters}</button>
      </div>}
      {fd.length===0?<div style={{textAlign:"center",padding:50,color:C.textM}}>{t.noResults}</div>:
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{fd.map((c,idx)=>{const cTags=tags.filter(tg=>c.tags.includes(tg.id));return(
        <div key={c.id} style={{display:"flex",alignItems:"center",gap:13,padding:"12px 16px",background:C.surface,borderRadius:13,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .2s",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(6px)",transitionDelay:`${idx*25}ms`,boxShadow:C.cardShadow}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.surfaceH}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface}} onClick={()=>setContactDetail(c.id)}>
          <div style={{width:38,height:38,borderRadius:11,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:15,flexShrink:0}}>{(R?c.name:c.nameEn).charAt(0)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{R?c.name:c.nameEn}</span>{c.starred&&<Star size={12} color="#f59e0b" fill="#f59e0b"/>}</div>
            <div style={{fontSize:11,color:C.textM,display:"flex",alignItems:"center",gap:10,marginTop:1}}>{c.company&&<span><Building2 size={10} style={{marginInlineEnd:2}}/>{R?c.company:c.companyEn}</span>}<span><Mail size={10} style={{marginInlineEnd:2}}/>{c.email}</span></div>
          </div>
          {cTags.length>0&&<div style={{display:"flex",gap:3}}>{cTags.slice(0,2).map(tg=><span key={tg.id} style={{padding:"2px 7px",borderRadius:9,fontSize:9,fontWeight:600,background:tg.color+"20",color:tg.color}}>{R?tg.name:tg.nameEn}</span>)}</div>}
          <Badge color={stC[c.status]}>{t[c.status]}</Badge>
          <div style={{display:"flex",gap:2}} onClick={e=>e.stopPropagation()}>
            <IBtn icon={Edit3} size={14} onClick={()=>{setEditItem(c);setModal("contact")}}/>
            <IBtn icon={Trash2} size={14} onClick={()=>fsSetContacts(cs=>cs.filter(x=>x.id!==c.id))}/>
          </div>
        </div>
      )})}</div>}
    </div>);
  };

  // DEALS - Drag & Drop Kanban
  const DealsV=()=>{
    const stages=["qualification","proposal","negotiation","closed_won","closed_lost"];
    const fd=deals.filter(d=>{const q=searchQ.toLowerCase();return !q||d.name.includes(q)||d.nameEn.toLowerCase().includes(q)});
    const handleDragStart=(e,deal)=>{setDragDeal(deal);e.dataTransfer.effectAllowed="move"};
    const handleDragOver=(e,stage)=>{e.preventDefault();setDragOver(stage)};
    const handleDrop=(e,stage)=>{e.preventDefault();if(dragDeal){fsSetDeals(ds=>ds.map(d=>d.id===dragDeal.id?{...d,stage}:d));showToast(t.dealUpdated)}setDragDeal(null);setDragOver(null)};
    return(<div>
      <div style={{display:"flex",gap:10,marginBottom:18}}>
        <div style={{flex:1,padding:"12px 16px",background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,boxShadow:C.cardShadow}}><TrendingUp size={18} color="#6366f1"/><div><div style={{fontSize:18,fontWeight:700,color:C.text}}>{fmt(stats.tp)}</div><div style={{fontSize:10,color:C.textM}}>{t.totalPipeline}</div></div></div>
        <div style={{flex:1,padding:"12px 16px",background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,boxShadow:C.cardShadow}}><DollarSign size={18} color="#22c55e"/><div><div style={{fontSize:18,fontWeight:700,color:C.text}}>{fmt(Math.round(stats.wp))}</div><div style={{fontSize:10,color:C.textM}}>{t.weightedValue}</div></div></div>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:18,height:6,borderRadius:3,overflow:"hidden"}}>{stages.map(s=>{const cnt=fd.filter(d=>d.stage===s).length;return<div key={s} style={{flex:Math.max(cnt,.5),background:sgC[s],transition:"flex .5s"}}/>})}</div>
      <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:8}}>
        {stages.map(stage=>{
          const sd=fd.filter(d=>d.stage===stage);
          return(<div key={stage} onDragOver={e=>handleDragOver(e,stage)} onDrop={e=>handleDrop(e,stage)} style={{minWidth:210,flex:1,display:"flex",flexDirection:"column",background:dragOver===stage?C.accentS:"transparent",borderRadius:12,padding:dragOver===stage?6:0,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"0 4px"}}><div style={{width:8,height:8,borderRadius:3,background:sgC[stage]}}/><span style={{fontSize:12,fontWeight:600,color:C.text}}>{t[stage]}</span><span style={{fontSize:10,background:C.bg,padding:"1px 7px",borderRadius:10,color:C.textM,fontWeight:600}}>{sd.length}</span></div>
            <div style={{fontSize:11,color:C.textM,marginBottom:10,padding:"0 4px",fontWeight:600}}>{fmt(sd.reduce((s,d)=>s+d.value,0))}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
              {sd.map((d,idx)=>(
                <div key={d.id} draggable onDragStart={e=>handleDragStart(e,d)} style={{padding:"12px 14px",background:C.surface,borderRadius:11,border:`1px solid ${C.border}`,borderTop:`3px solid ${sgC[stage]}`,cursor:"grab",transition:"all .2s",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(6px)",transitionDelay:`${idx*30}ms`,boxShadow:C.cardShadow}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,.15)"}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.cardShadow}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}><GripVertical size={12} color={C.textD}/><span style={{fontSize:12,fontWeight:600,color:C.text}}>{R?d.name:d.nameEn}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8,cursor:"pointer"}} onClick={()=>setContactDetail(d.contactId)}><User size={11} color={C.textM}/><span style={{fontSize:10,color:C.accent,textDecoration:"underline"}}>{cn(d.contactId)}</span></div>
                  <div style={{height:4,background:C.bg,borderRadius:2,marginBottom:7}}><div style={{height:"100%",width:`${d.probability}%`,background:sgC[stage],borderRadius:2,transition:"width .3s"}}/></div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:C.accent}}>{fmt(d.value)}</span><span style={{fontSize:10,color:C.textM}}>{d.probability}%</span></div>
                  <div style={{display:"flex",gap:2,marginTop:8,justifyContent:"flex-end"}}><IBtn icon={Edit3} size={13} onClick={()=>{setEditItem(d);setModal("deal")}}/><IBtn icon={Trash2} size={13} onClick={()=>fsSetDeals(ds=>ds.filter(x=>x.id!==d.id))}/></div>
                </div>
              ))}
            </div>
          </div>);
        })}
      </div>
    </div>);
  };

  // TASKS
  const TasksV=()=>{
    const today="2026-02-25";
    const fd=tasks.filter(task=>{const q=searchQ.toLowerCase();return(!q||task.title.includes(q)||task.titleEn.toLowerCase().includes(q))&&(tFilter==="all"||task.status===tFilter||(tFilter==="overdue"&&task.status!=="done"&&task.dueDate<today))});
    return(<div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>{["all","todo","in_progress","done","overdue"].map(f=><button key={f} onClick={()=>setTFilter(f)} style={{padding:"5px 13px",borderRadius:20,border:`1px solid ${tFilter===f?C.accent:C.border}`,background:tFilter===f?C.accentS:"transparent",color:tFilter===f?C.accent:C.textM,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:ff}}>{t[f]}</button>)}</div>
      {fd.length===0?<div style={{textAlign:"center",padding:50,color:C.textM}}>{t.noResults}</div>:
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{fd.map((task,idx)=>{const isOD=task.status!=="done"&&task.dueDate<today;return(
        <div key={task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.surface,borderRadius:13,border:`1px solid ${isOD?C.danger+"40":C.border}`,transition:"all .2s",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(6px)",transitionDelay:`${idx*25}ms`,boxShadow:C.cardShadow}} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceH} onMouseLeave={e=>e.currentTarget.style.background=C.surface}>
          <button onClick={()=>fsSetTasks(ts=>ts.map(x=>x.id===task.id?{...x,status:x.status==="done"?"todo":"done"}:x))} style={{width:22,height:22,borderRadius:7,border:`2px solid ${task.status==="done"?C.ok:C.border}`,background:task.status==="done"?C.ok:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .2s"}}>{task.status==="done"&&<CheckCircle2 size={13} color="#fff"/>}</button>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:task.status==="done"?C.textD:C.text,textDecoration:task.status==="done"?"line-through":"none"}}>{R?task.title:task.titleEn}</div>
            <div style={{fontSize:11,color:C.textM,display:"flex",alignItems:"center",gap:10,marginTop:2}}><span style={{cursor:"pointer",color:C.accent,textDecoration:"underline"}} onClick={()=>setContactDetail(task.contactId)}>{cn(task.contactId)}</span><span style={{color:isOD?C.danger:C.textM}}><Calendar size={10} style={{marginInlineEnd:2}}/>{task.dueDate}</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:4,background:prC[task.priority]}}/><span style={{fontSize:10,color:C.textM}}>{t[task.priority]}</span></div>
          <Badge color={{bg:`${tsC[isOD?"overdue":task.status]}20`,text:tsC[isOD?"overdue":task.status]}}>{isOD?t.overdue:t[task.status]}</Badge>
          <div style={{display:"flex",gap:2}}><IBtn icon={Edit3} size={14} onClick={()=>{setEditItem(task);setModal("task")}}/><IBtn icon={Trash2} size={14} onClick={()=>fsSetTasks(ts=>ts.filter(x=>x.id!==task.id))}/></div>
        </div>
      )})}</div>}
    </div>);
  };

  // CALENDAR
  const CalendarV=()=>{
    const y=calYear,m=calMonth;const dim=new Date(y,m+1,0).getDate();const fd=new Date(y,m,1).getDay();
    const days=[];for(let j=0;j<fd;j++)days.push(null);for(let j=1;j<=dim;j++)days.push(j);
    return(<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><IBtn icon={R?ChevronRight:ChevronLeft} onClick={()=>{if(m===0){setCalMonth(11);setCalYear(v=>v-1)}else setCalMonth(v=>v-1)}}/><h2 style={{margin:0,fontSize:17,fontWeight:700,color:C.text}}>{t.monthL[m]} {y}</h2><IBtn icon={R?ChevronLeft:ChevronRight} onClick={()=>{if(m===11){setCalMonth(0);setCalYear(v=>v+1)}else setCalMonth(v=>v+1)}}/></div>
        <button onClick={()=>{setCalMonth(1);setCalYear(2026)}} style={{...bS,padding:"5px 12px",fontSize:11}}>{t.today}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>{t.dayN.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:C.textM,padding:5}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>{days.map((day,idx)=>{
        if(!day)return<div key={idx}/>;
        const ds=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const dm=meetings.filter(mt=>mt.date===ds);const dt=tasks.filter(tk=>tk.dueDate===ds);const isT=ds==="2026-02-25";
        return(<div key={idx} style={{minHeight:80,padding:5,background:isT?C.accentS:C.surface,borderRadius:10,border:`1px solid ${isT?C.accent:C.border}`,transition:"all .15s",cursor:"pointer",boxShadow:C.cardShadow}} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceH} onMouseLeave={e=>e.currentTarget.style.background=isT?C.accentS:C.surface}>
          <div style={{fontSize:12,fontWeight:isT?700:500,color:isT?C.accent:C.text,marginBottom:3}}>{day}</div>
          {dm.map(mt=><div key={mt.id} style={{fontSize:9,padding:"2px 4px",background:mt.color+"20",color:mt.color,borderRadius:4,marginBottom:2,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} onClick={()=>{setEditItem(mt);setModal("meeting")}}>{mt.time} {R?mt.title:mt.titleEn}</div>)}
          {dt.map(tk=><div key={tk.id} style={{fontSize:9,padding:"2px 4px",background:prC[tk.priority]+"20",color:prC[tk.priority],borderRadius:4,marginBottom:2,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{R?tk.title:tk.titleEn}</div>)}
        </div>);
      })}</div>
    </div>);
  };

  // REPORTS
  const ReportsV=()=>{
    const ec=()=>exportXL(contacts.map(c=>({Name:c.name,Email:c.email,Phone:c.phone,Company:c.company,Status:c.status})),"contacts");
    const ed=()=>exportXL(deals.map(d=>({Name:d.name,Contact:cn(d.contactId),Value:d.value,Stage:d.stage,Prob:d.probability+"%"})),"deals");
    const et=()=>exportXL(tasks.map(tk=>({Title:tk.title,Contact:cn(tk.contactId),Priority:tk.priority,Status:tk.status,Due:tk.dueDate})),"tasks");
    const reps=[{icon:Users,title:t.contactsReport,desc:`${contacts.length}`,color:"#6366f1",action:ec},{icon:Briefcase,title:t.dealsReport,desc:fmt(deals.reduce((s,d)=>s+d.value,0)),color:"#f59e0b",action:ed},{icon:ListTodo,title:t.tasksReport,desc:`${tasks.length}`,color:"#22c55e",action:et}];
    const statusChartData=["customer","lead","prospect","inactive"].map(k=>({name:t[k],value:contacts.filter(c=>c.status===k).length,color:stC[k].text}));
    return(<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>{reps.map((r,idx)=>(
        <div key={idx} onClick={r.action} style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .2s",boxShadow:C.cardShadow}} onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{background:`${r.color}14`,borderRadius:10,padding:9,display:"flex"}}><r.icon size={20} color={r.color}/></div><div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{r.title}</div><div style={{fontSize:11,color:C.textM}}>{r.desc}</div></div></div>
          <button style={{...bP,width:"100%",padding:"7px",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={13}/>{t.exportExcel}</button>
        </div>
      ))}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
          <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:C.text}}>{t.summaryReport}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{padding:14,background:C.bg,borderRadius:10,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#6366f1"}}>{contacts.length}</div><div style={{fontSize:10,color:C.textM}}>{t.totalContacts}</div></div>
            <div style={{padding:14,background:C.bg,borderRadius:10,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#f59e0b"}}>{fmt(Math.round(stats.rev))}</div><div style={{fontSize:10,color:C.textM}}>{t.totalRevenue}</div></div>
            <div style={{padding:14,background:C.bg,borderRadius:10,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{stats.cr}%</div><div style={{fontSize:10,color:C.textM}}>{t.closingRate}</div></div>
            <div style={{padding:14,background:C.bg,borderRadius:10,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{stats.pt}</div><div style={{fontSize:10,color:C.textM}}>{t.pendingTasks}</div></div>
          </div>
        </div>
        <div style={{background:C.surface,borderRadius:16,padding:20,border:`1px solid ${C.border}`,boxShadow:C.cardShadow}}>
          <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:C.text}}>{t.contacts} by {t.status}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="name" tick={{fontSize:10,fill:C.textD}} stroke={C.border}/><YAxis tick={{fontSize:10,fill:C.textD}} stroke={C.border}/><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,color:C.text}}/><Bar dataKey="value" radius={[6,6,0,0]}>{statusChartData.map((e,idx)=><Cell key={idx} fill={e.color}/>)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
  };

  // ADMIN
  const AdminV=()=>{
    const[exp,setExp]=useState(null);
    const fd=users.filter(u=>{const q=searchQ.toLowerCase();return !q||u.name.includes(q)||u.nameEn.toLowerCase().includes(q)});
    return(<div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>{Object.entries(rlC).map(([role,rc])=>{const RI=rc.I;return(<div key={role} style={{background:C.surface,borderRadius:13,padding:"14px 16px",border:`1px solid ${C.border}`,flex:1,minWidth:120,display:"flex",alignItems:"center",gap:10,boxShadow:C.cardShadow}}><div style={{background:rc.bg,borderRadius:9,padding:8,display:"flex"}}><RI size={17} color={rc.text}/></div><div><div style={{fontSize:18,fontWeight:700,color:C.text}}>{users.filter(u=>u.role===role).length}</div><div style={{fontSize:10,color:C.textM}}>{t[role+"Role"]}</div></div></div>)})}</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{fd.map((u,idx)=>{const rc=rlC[u.role];const RI=rc.I;const isE=exp===u.id;return(
        <div key={u.id} style={{background:C.surface,borderRadius:13,border:`1px solid ${u.status==="suspended"?C.danger+"30":C.border}`,overflow:"hidden",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(6px)",transitionDelay:`${idx*25}ms`,transition:"all .2s",boxShadow:C.cardShadow}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer"}} onClick={()=>setExp(isE?null:u.id)} onMouseEnter={e=>e.currentTarget.style.background=C.surfaceH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:38,height:38,borderRadius:10,background:u.status==="suspended"?C.border:C.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,opacity:u.status==="suspended"?.5:1}}>{u.avatar}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:u.status==="suspended"?C.textD:C.text}}>{R?u.name:u.nameEn}{u.status==="suspended"&&<Badge color={{bg:`${C.danger}20`,text:C.danger}} style={{marginInlineStart:6}}>{t.suspended}</Badge>}</div><div style={{fontSize:10,color:C.textM}}>{u.email} · {u.lastLogin}</div></div>
            <Badge color={rc}><RI size={10} style={{marginInlineEnd:3}}/>{t[u.role+"Role"]}</Badge>
            <div style={{display:"flex",gap:2}} onClick={e=>e.stopPropagation()}><IBtn icon={Edit3} size={14} onClick={()=>{setEditItem(u);setModal("user")}}/><IBtn icon={u.status==="active"?Lock:Unlock} size={14} onClick={()=>fsSetUsers(us=>us.map(x=>x.id===u.id?{...x,status:x.status==="active"?"suspended":"active"}:x))}/><IBtn icon={Trash2} size={14} onClick={()=>fsSetUsers(us=>us.filter(x=>x.id!==u.id))}/></div>
            <IBtn icon={isE?ChevronUp:ChevronDown} size={13}/>
          </div>
          {isE&&<div style={{padding:"0 16px 14px",borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>{permKeys.map(k=><div key={k} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",borderRadius:6,background:u.permissions[k]?`${C.ok}08`:`${C.danger}08`,fontSize:10}}>{u.permissions[k]?<Check size={11} color={C.ok}/>:<X size={11} color={C.danger}/>}<span style={{color:u.permissions[k]?C.text:C.textD}}>{t[k]}</span></div>)}</div></div>}
        </div>
      )})}</div>
    </div>);
  };

  // NAV
  const navItems=[{key:"dashboard",icon:BarChart3},{key:"contacts",icon:Users},{key:"deals",icon:Briefcase},{key:"tasks",icon:ListTodo},{key:"calendar",icon:Calendar},{key:"reports",icon:FileText},{key:"admin",icon:Shield}];
  const addActs={contacts:()=>setModal("contact"),deals:()=>setModal("deal"),tasks:()=>setModal("task"),calendar:()=>setModal("meeting"),admin:()=>setModal("user")};
  const addLabels={contacts:t.addContact,deals:t.addDeal,tasks:t.addTask,calendar:t.newMeeting,admin:t.addUser};

  return(
    <div dir={R?"rtl":"ltr"} style={{fontFamily:ff,background:C.bg,color:C.text,minHeight:"100vh",display:"flex",direction:R?"rtl":"ltr",transition:"background .3s, color .3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        input:focus,select:focus,textarea:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px ${C.accentS}}button:active{transform:scale(.97)}
      `}</style>

      {/* Toast */}
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:2000,padding:"10px 20px",borderRadius:12,background:toast.type==="success"?"#166534":"#991b1b",color:"#fff",fontSize:12,fontWeight:600,fontFamily:ff,display:"flex",alignItems:"center",gap:6,animation:"slideUp .25s",boxShadow:"0 8px 30px rgba(0,0,0,.3)"}}>{toast.type==="success"?<CheckCircle2 size={15}/>:<AlertTriangle size={15}/>}{toast.msg}</div>}

      {/* Cmd+K */}
      {cmdK&&<CmdKPalette/>}

      {/* Sidebar */}
      <aside style={{width:sideOpen?200:60,background:C.surface,borderInlineEnd:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0,transition:"width .25s ease",overflow:"hidden"}}>
        <div style={{padding:sideOpen?"20px 16px 16px":"20px 12px 16px",display:"flex",alignItems:"center",gap:10,justifyContent:sideOpen?"flex-start":"center"}}>
          {sideOpen?<><div style={{width:32,height:32,borderRadius:9,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center"}}><Target size={17} color="#fff"/></div><span style={{fontSize:16,fontWeight:800,background:C.gradText,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap"}}>{t.appName}</span></>:<div style={{width:32,height:32,borderRadius:9,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center"}}><Target size={17} color="#fff"/></div>}
        </div>
        <nav style={{flex:1,padding:sideOpen?"4px 8px":"4px",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item=><button key={item.key} onClick={()=>setTab(item.key)} title={t[item.key]} style={{display:"flex",alignItems:"center",gap:10,padding:sideOpen?"8px 12px":"8px",borderRadius:9,border:"none",background:tab===item.key?C.accentS:"transparent",color:tab===item.key?C.accent:C.textM,fontSize:12,fontWeight:tab===item.key?600:500,cursor:"pointer",fontFamily:ff,transition:"all .15s",textAlign:R?"right":"left",width:"100%",justifyContent:sideOpen?"flex-start":"center"}}><item.icon size={16}/>{sideOpen&&<span style={{whiteSpace:"nowrap"}}>{t[item.key]}</span>}</button>)}
        </nav>
        {sideOpen&&<div style={{padding:"8px 8px 4px",borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:9,fontWeight:600,color:C.textD,padding:"0 4px 5px",letterSpacing:.5}}>{t.integrations}</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 8px",borderRadius:7,background:C.bg,fontSize:10}}><MessageSquare size={13} color="#25d366"/><span style={{flex:1,color:C.text}}>WhatsApp</span><span style={{fontSize:8,color:C.ok}}>●</span></div>
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 8px",borderRadius:7,background:C.bg,fontSize:10}}><Calendar size={13} color="#4285f4"/><span style={{flex:1,color:C.text}}>Google Cal</span><span style={{fontSize:8,color:C.ok}}>●</span></div>
          </div>
        </div>}
        <div style={{padding:"8px",display:"flex",flexDirection:"column",gap:3,borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setTheme(th=>th==="dark"?"light":"dark")} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"none",background:"transparent",color:C.textM,fontSize:11,cursor:"pointer",fontFamily:ff,justifyContent:sideOpen?"flex-start":"center"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}{sideOpen&&(theme==="dark"?"Light":"Dark")}</button>
          <button onClick={()=>setLang(l=>l==="he"?"en":"he")} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"none",background:"transparent",color:C.textM,fontSize:11,cursor:"pointer",fontFamily:ff,justifyContent:sideOpen?"flex-start":"center"}}><Globe size={15}/>{sideOpen&&(lang==="he"?"EN":"עב")}</button>
          <button onClick={()=>setSideOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"none",background:"transparent",color:C.textM,fontSize:11,cursor:"pointer",fontFamily:ff,justifyContent:sideOpen?"flex-start":"center"}}><Menu size={15}/>{sideOpen&&"☰"}</button>
          {currentUser&&<button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"none",background:"transparent",color:C.danger,fontSize:11,cursor:"pointer",fontFamily:ff,justifyContent:sideOpen?"flex-start":"center"}}><LogOut size={15}/>{sideOpen&&(R?"יציאה":"Logout")}</button>}
        </div>
        {sideOpen&&currentUser&&<div style={{padding:"8px 12px 10px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{(currentUser.displayName||currentUser.email||"?").charAt(0).toUpperCase()}</div>
          <div style={{overflow:"hidden"}}><div style={{fontSize:11,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.displayName||"User"}</div><div style={{fontSize:9,color:C.textD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.email}</div></div>
        </div>}
      </aside>

      {/* Main */}
      <main style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",overflow:"hidden"}}>
        <header style={{padding:"12px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface,position:"sticky",top:0,zIndex:10}}>
          <h1 style={{fontSize:18,fontWeight:700,margin:0}}>{t[tab]||tab}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {/* Search + Cmd+K hint */}
            <div style={{position:"relative"}}><Search size={14} style={{position:"absolute",top:"50%",[R?"right":"left"]:10,transform:"translateY(-50%)",color:C.textD}}/><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onFocus={()=>{}} placeholder={t.search} style={{padding:"7px 11px",[R?"paddingRight":"paddingLeft"]:32,borderRadius:9,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,outline:"none",width:180,fontFamily:ff,direction:R?"rtl":"ltr"}}/><kbd onClick={()=>{setCmdK(true);setCmdQ("")}} style={{position:"absolute",top:"50%",[R?"left":"right"]:8,transform:"translateY(-50%)",padding:"1px 6px",borderRadius:4,background:C.surfaceH,color:C.textD,fontSize:9,border:`1px solid ${C.border}`,cursor:"pointer"}}>⌘K</kbd></div>
            {/* Notifications */}
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowNotif(!showNotif)} style={{background:"transparent",border:"none",cursor:"pointer",position:"relative",padding:5,borderRadius:8,display:"flex"}}><Bell size={17} color={C.textM}/>{unread>0&&<div style={{position:"absolute",top:1,[R?"left":"right"]:1,width:14,height:14,borderRadius:7,background:C.danger,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff"}}>{unread}</div>}</button>
              {showNotif&&<div style={{position:"absolute",top:"100%",[R?"left":"right"]:0,marginTop:6,width:300,background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:6,zIndex:100,boxShadow:"0 12px 40px rgba(0,0,0,.3)",animation:"slideUp .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px"}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>{t.notifications}</span><button onClick={()=>{setNotifs(ns=>ns.map(n=>({...n,read:true})));setShowNotif(false)}} style={{fontSize:10,color:C.accent,background:"none",border:"none",cursor:"pointer",fontFamily:ff}}>{t.markAllRead}</button></div>
                {notifs.map(n=><div key={n.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 10px",borderRadius:8,background:n.read?"transparent":C.accentS,cursor:"pointer",marginBottom:1}} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))}><div style={{width:7,height:7,borderRadius:4,background:n.read?"transparent":n.color,marginTop:5,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:11,color:n.read?C.textM:C.text,fontWeight:n.read?400:600}}>{R?n.text:n.textEn}</div><div style={{fontSize:9,color:C.textD,marginTop:1}}>{R?n.time:n.timeEn}</div></div></div>)}
              </div>}
            </div>
            {tab==="contacts"&&<button onClick={()=>setModal("commlog")} style={{...bS,padding:"6px 12px",fontSize:11,display:"flex",alignItems:"center",gap:4}}><MessageSquare size={13}/></button>}
            {tab==="contacts"&&<button onClick={()=>setModal("import")} style={{...bS,padding:"6px 12px",fontSize:11,display:"flex",alignItems:"center",gap:4}}><Upload size={13}/></button>}
            {addActs[tab]&&<button onClick={addActs[tab]} style={{...bP,display:"flex",alignItems:"center",gap:4,padding:"6px 14px",fontSize:12}}><Plus size={14}/>{sideOpen?addLabels[tab]:""}</button>}
          </div>
        </header>
        <div style={{flex:1,padding:22,overflowY:"auto"}}>
          {tab==="dashboard"&&<DashboardV/>}
          {tab==="contacts"&&<ContactsV/>}
          {tab==="deals"&&<DealsV/>}
          {tab==="tasks"&&<TasksV/>}
          {tab==="calendar"&&<CalendarV/>}
          {tab==="reports"&&<ReportsV/>}
          {tab==="admin"&&<AdminV/>}
        </div>
      </main>

      {/* Modals */}
      {modal==="contact"&&<ContactModal_/>}
      {modal==="deal"&&<DealModal_/>}
      {modal==="task"&&<TaskModal_/>}
      {modal==="meeting"&&<MeetingModal_/>}
      {modal==="import"&&<ImportModal_/>}
      {modal==="user"&&<UserModal_/>}
      {modal==="commlog"&&<CommLogModal_/>}
      {contactDetail&&<ContactProfile_/>}
    </div>
  );
}
