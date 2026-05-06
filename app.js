import { auth, db, rtdb } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const resetModal = document.getElementById('resetModal');
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const userName = document.getElementById('userName');
const sellerFields = document.getElementById('sellerFields');

// Helper: Show/Hide modals
window.showLoginModal = () => loginModal.style.display = 'block';
window.showRegisterModal = () => registerModal.style.display = 'block';
window.showResetPassword = () => {
    loginModal.style.display = 'none';
    resetModal.style.display = 'block';
};

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        resetModal.style.display = 'none';
    };
});

// Show seller fields when role is seller
document.getElementById('registerRole')?.addEventListener('change', (e) => {
    sellerFields.style.display = e.target.value === 'seller' ? 'block' : 'none';
});

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        
        // Store user data in Firestore
        const userData = {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            createdAt: serverTimestamp(),
            isActive: true
        };
        
        if (role === 'seller') {
            userData.sellerProfile = {
                specialization: document.getElementById('sellerSpecialization').value,
                bio: document.getElementById('sellerBio').value,
                rating: 0,
                totalRatings: 0,
                completedOrders: 0
            };
        }
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        alert('تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني.');
        registerModal.style.display = 'none';
        
    } catch (error) {
        alert('خطأ: ' + error.message);
    }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginModal.style.display = 'none';
        
        // Check if email is verified
        if (!auth.currentUser.emailVerified) {
            alert('يرجى تأكيد بريدك الإلكتروني أولاً!');
            await signOut(auth);
        }
    } catch (error) {
        alert('خطأ في الدخول: ' + error.message);
    }
});

// Reset Password
document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    try {
        await sendPasswordResetEmail(auth, email);
        alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
        resetModal.style.display = 'none';
    } catch (error) {
        alert('خطأ: ' + error.message);
    }
});

// Logout
window.logout = async () => {
    await signOut(auth);
    window.location.href = '/';
};

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    if (user && user.emailVerified) {
        // User is logged in
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = user.displayName || user.email;
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect based on role
            if (userData.role === 'owner') {
                window.location.href = '/admin-dashboard.html';
            }
        }
    } else {
        // User is logged out
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
    }
});

// Create Order Function
window.createOrder = async (title, description, budget, requiredSkill) => {
    const user = auth.currentUser;
    if (!user) {
        alert('يرجى تسجيل الدخول أولاً');
        return;
    }
    
    try {
        const order = {
            title: title,
            description: description,
            budget: budget,
            requiredSkill: requiredSkill,
            buyerId: user.uid,
            buyerName: user.displayName,
            status: 'pending',
            createdAt: serverTimestamp(),
            matchedSellers: []
        };
        
        const docRef = await addDoc(collection(db, 'orders'), order);
        
        // Find matching sellers
        const sellersQuery = query(
            collection(db, 'users'),
            where('role', '==', 'seller'),
            where('sellerProfile.specialization', '==', requiredSkill)
        );
        
        const sellersSnapshot = await getDocs(sellersQuery);
        sellersSnapshot.forEach(async (sellerDoc) => {
            const sellerData = sellerDoc.data();
            // Send notification to seller (you can implement FCM here)
            console.log(`Matched with seller: ${sellerData.name}`);
        });
        
        alert('تم إنشاء الطلب بنجاح! سيتم إخطار البائعين المناسبين.');
        return docRef.id;
        
    } catch (error) {
        alert('خطأ في إنشاء الطلب: ' + error.message);
    }
};

// Initialize chat
window.initChat = (orderId, sellerId, buyerId) => {
    const chatRef = ref(rtdb, `chats/${orderId}`);
    
    // Send message
    window.sendMessage = async (messageText) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const message = {
            text: messageText,
            senderId: user.uid,
            senderName: user.displayName,
            timestamp: Date.now()
        };
        
        await set(ref(rtdb, `chats/${orderId}/${Date.now()}`), message);
    };
    
    // Listen for messages
    onChildAdded(chatRef, (snapshot) => {
        const message = snapshot.val();
        // Display message in UI (implement based on your chat UI)
        console.log('New message:', message);
    });
};

// Load user dashboard based on role
async function loadDashboard() {
    const user = auth.currentUser;
    if (!user) return;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    
    if (userData.role === 'buyer') {
        // Show buyer dashboard - their orders
        const ordersQuery = query(
            collection(db, 'orders'),
            where('buyerId', '==', user.uid)
        );
        const orders = await getDocs(ordersQuery);
        console.log('Your orders:', orders.docs.map(doc => doc.data()));
        
    } else if (userData.role === 'seller') {
        // Show seller dashboard - available orders matching their skills
        const ordersQuery = query(
            collection(db, 'orders'),
            where('requiredSkill', '==', userData.sellerProfile.specialization),
            where('status', '==', 'pending')
        );
        const orders = await getDocs(ordersQuery);
        console.log('Available orders for you:', orders.docs.map(doc => doc.data()));
    }
}

// Call loadDashboard when user is authenticated
onAuthStateChanged(auth, async (user) => {
    if (user && user.emailVerified) {
        await loadDashboard();
    }
});

console.log('🚀 Marketplace app initialized successfully!');