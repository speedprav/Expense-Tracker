import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English, Hindi, and Spanish translations
const resources = {
  English: {
    translation: {
      // Navigation
      "Home": "Home",
      "Analytics": "Analytics",
      "Ledger": "Ledger",
      "Profile": "Profile",
      "Calendar": "Calendar",
      "Logout": "Logout",
      
      // Dashboard
      "Total Balance": "Total Balance",
      "Income": "Income",
      "Expense": "Expense",
      "Recent Transactions": "Recent Transactions",
      "No recent transactions": "No recent transactions.",
      "Add Income": "Add Income",
      "Add Expense": "Add Expense",
      "Add": "Add",
      "Amount": "Amount",
      "Description": "Description",
      "Cancel": "Cancel",
      
      // Ledger
      "Shared Ledger": "Shared Ledger",
      "Add Person": "Add Person",
      "Name": "Name",
      "Transactions": "Transactions",
      "No people added yet": "No people added yet.",
      
      // Profile
      "Profile Settings": "Profile Settings",
      "Full Name": "Full Name",
      "Account Mode": "Account Mode",
      "Personal": "Personal",
      "Business": "Business",
      "Business Name": "Business Name",
      "Monthly Budget": "Monthly Budget",
      "Currency": "Currency",
      "Language": "Language",
      "Save Settings": "Save Settings",
      "Settings Saved!": "Settings Saved!",
      
      // Auth
      "Welcome back! Please login.": "Welcome back! Please login.",
      "Create your account and setup your profile.": "Create your account and setup your profile.",
      "Email Address": "Email Address",
      "Password": "Password",
      "Sign In": "Sign In",
      "Create Account": "Create Account",
      "Don't have an account? ": "Don't have an account? ",
      "Already have an account? ": "Already have an account? ",
      "Sign up": "Sign up",
      "Log in": "Log in",
      
      // Common
      "Yes": "Yes",
      "No": "No"
    }
  },
  Hindi: {
    translation: {
      // Navigation
      "Home": "होम",
      "Analytics": "विश्लेषण",
      "Ledger": "खाता",
      "Profile": "प्रोफ़ाइल",
      "Calendar": "कैलेंडर",
      "Logout": "लॉग आउट",
      
      // Dashboard
      "Total Balance": "कुल शेष",
      "Income": "आय",
      "Expense": "खर्च",
      "Recent Transactions": "हाल के लेन-देन",
      "No recent transactions": "कोई हाल का लेन-देन नहीं।",
      "Add Income": "आय जोड़ें",
      "Add Expense": "खर्च जोड़ें",
      "Add": "जोड़ें",
      "Amount": "राशि",
      "Description": "विवरण",
      "Cancel": "रद्द करें",
      
      // Ledger
      "Shared Ledger": "साझा खाता",
      "Add Person": "व्यक्ति जोड़ें",
      "Name": "नाम",
      "Transactions": "लेन-देन",
      "No people added yet": "अभी तक कोई व्यक्ति नहीं जोड़ा गया।",
      
      // Profile
      "Profile Settings": "प्रोफ़ाइल सेटिंग",
      "Full Name": "पूरा नाम",
      "Account Mode": "खाता मोड",
      "Personal": "व्यक्तिगत",
      "Business": "व्यापार",
      "Business Name": "व्यापार का नाम",
      "Monthly Budget": "मासिक बजट",
      "Currency": "मुद्रा",
      "Language": "भाषा",
      "Save Settings": "सेटिंग सहेजें",
      "Settings Saved!": "सेटिंग सहेजी गई!",
      
      // Auth
      "Welcome back! Please login.": "वापसी पर स्वागत है! कृपया लॉग इन करें।",
      "Create your account and setup your profile.": "अपना खाता बनाएं और प्रोफ़ाइल सेट करें।",
      "Email Address": "ईमेल पता",
      "Password": "पासवर्ड",
      "Sign In": "साइन इन",
      "Create Account": "खाता बनाएं",
      "Don't have an account? ": "क्या आपके पास खाता नहीं है? ",
      "Already have an account? ": "क्या आपके पास पहले से खाता है? ",
      "Sign up": "साइन अप करें",
      "Log in": "लॉग इन करें",
      
      // Common
      "Yes": "हाँ",
      "No": "नहीं"
    }
  },
  Spanish: {
    translation: {
      // Navigation
      "Home": "Inicio",
      "Analytics": "Análisis",
      "Ledger": "Libro mayor",
      "Profile": "Perfil",
      "Calendar": "Calendario",
      "Logout": "Cerrar sesión",
      
      // Dashboard
      "Total Balance": "Saldo Total",
      "Income": "Ingresos",
      "Expense": "Gastos",
      "Recent Transactions": "Transacciones Recientes",
      "No recent transactions": "No hay transacciones recientes.",
      "Add Income": "Añadir Ingreso",
      "Add Expense": "Añadir Gasto",
      "Add": "Añadir",
      "Amount": "Cantidad",
      "Description": "Descripción",
      "Cancel": "Cancelar",
      
      // Ledger
      "Shared Ledger": "Libro Compartido",
      "Add Person": "Añadir Persona",
      "Name": "Nombre",
      "Transactions": "Transacciones",
      "No people added yet": "Aún no se han añadido personas.",
      
      // Profile
      "Profile Settings": "Configuración del Perfil",
      "Full Name": "Nombre Completo",
      "Account Mode": "Modo de Cuenta",
      "Personal": "Personal",
      "Business": "Negocio",
      "Business Name": "Nombre del Negocio",
      "Monthly Budget": "Presupuesto Mensual",
      "Currency": "Moneda",
      "Language": "Idioma",
      "Save Settings": "Guardar Configuración",
      "Settings Saved!": "¡Configuración Guardada!",
      
      // Auth
      "Welcome back! Please login.": "¡Bienvenido de nuevo! Inicie sesión.",
      "Create your account and setup your profile.": "Crea tu cuenta y configura tu perfil.",
      "Email Address": "Correo Electrónico",
      "Password": "Contraseña",
      "Sign In": "Iniciar Sesión",
      "Create Account": "Crear Cuenta",
      "Don't have an account? ": "¿No tienes una cuenta? ",
      "Already have an account? ": "¿Ya tienes una cuenta? ",
      "Sign up": "Regístrate",
      "Log in": "Iniciar sesión",
      
      // Common
      "Yes": "Sí",
      "No": "No"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "English", // Default language
    fallbackLng: "English",
    interpolation: {
      escapeValue: false // React already safely escapes
    }
  });

export default i18n;
