import {
  EmailAuthProvider,
  addDoc,
  auth,
  collection,
  createUserWithEmailAndPassword,
  deleteField,
  db,
  deleteDoc,
  deleteObject,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  functions,
  httpsCallable,
  onAuthStateChanged,
  onSnapshot,
  query,
  reauthenticateWithCredential,
  ref,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  storage,
  updatePassword,
  updateDoc,
  uploadBytes,
  where,
  writeBatch
} from './firebase.js';

const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTitle = document.getElementById('authTitle');
const authStatus = document.getElementById('authStatus');
const authFooterText = document.getElementById('authFooterText');
const createAccountLink = document.getElementById('createAccountLink');
const authTabs = document.querySelectorAll('.mode-tab');
const topActions = document.querySelector('.top-actions');

const storeModal = document.getElementById('storeModal');
const closeStoreModal = document.getElementById('closeStoreModal');
const storeForm = document.getElementById('storeForm');
const storeTemplateModal = document.getElementById('storeTemplateModal');
const storeTemplateForm = document.getElementById('storeTemplateForm');
const storeTemplateMedia = document.getElementById('storeTemplateMedia');
const storeTemplateMediaPreview = document.getElementById('storeTemplateMediaPreview');
const storeTemplateSocialLinks = document.getElementById('storeTemplateSocialLinks');
const storeTemplateStatus = document.getElementById('storeTemplateStatus');
const closeStoreTemplate = document.getElementById('closeStoreTemplate');
const manageStorefrontButton = document.getElementById('manageStorefrontButton');
const storeLogoInput = document.getElementById('storeLogoInput');
const storeBannerInput = document.getElementById('storeBannerInput');
const storefrontHero = document.getElementById('storefrontHero');
const storefrontBanner = document.getElementById('storefrontBanner');
const storefrontLogo = document.getElementById('storefrontLogo');
const storefrontMessageButton = document.getElementById('storefrontMessageButton');
const storefrontSocials = document.getElementById('storefrontSocials');
const storefrontBio = document.getElementById('storefrontBio');
const storefrontBioAction = document.getElementById('storefrontBioAction');
const storefrontBioActionLabel = document.getElementById('storefrontBioActionLabel');
const storefrontBioEditor = document.getElementById('storefrontBioEditor');
const storefrontPosts = document.getElementById('storefrontPosts');
const storefrontCreatePost = document.getElementById('storefrontCreatePost');
const storeList = document.getElementById('storeList');
const storeModalTitle = document.getElementById('storeModalTitle');
const storeSubmitButton = document.getElementById('storeSubmitButton');
const storeDetailModal = document.getElementById('storeDetailModal');
const storeDetailContent = document.getElementById('storeDetailContent');
const manageStoresModal = document.getElementById('manageStoresModal');
const managedStoreList = document.getElementById('managedStoreList');
const accountModal = document.getElementById('accountModal');
const accountForm = document.getElementById('accountForm');
const passwordResetForm = document.getElementById('passwordResetForm');
const passwordResetStatus = document.getElementById('passwordResetStatus');
const discoverFeed = document.getElementById('discoverFeed');
const feedEmptyState = document.getElementById('feedEmptyState');
const discoverSearchInput = document.getElementById('discoverSearchInput');
const discoverSearchForm = document.getElementById('discoverSearchForm');
const discoverSearchStatus = document.getElementById('discoverSearchStatus');
const clearDiscoverSearch = document.getElementById('clearDiscoverSearch');
const postForm = document.getElementById('postForm');
const createPostModal = document.getElementById('createPostModal');
const postStorefrontSelect = document.getElementById('postStorefrontSelect');
const postUploadStatus = document.getElementById('postUploadStatus');
const managePostsModal = document.getElementById('managePostsModal');
const managedPostList = document.getElementById('managedPostList');
const projectRoomsPanel = document.getElementById('projectRoomsPanel');
const roomList = document.getElementById('roomList');
const roomPage = document.getElementById('roomPage');
const roomHero = document.getElementById('roomHero');
const roomBanner = document.getElementById('roomBanner');
const roomBannerInput = document.getElementById('roomBannerInput');
const roomPageTitle = document.getElementById('roomPageTitle');
const roomPageDescription = document.getElementById('roomPageDescription');
const roomCreatorName = document.getElementById('roomCreatorName');
const roomManager = document.getElementById('roomManager');
const roomTitleInput = document.getElementById('roomTitleInput');
const roomDescriptionInput = document.getElementById('roomDescriptionInput');
const roomStatus = document.getElementById('roomStatus');
const roomMessageList = document.getElementById('roomMessageList');
const roomMessageForm = document.getElementById('roomMessageForm');
const roomMessageInput = document.getElementById('roomMessageInput');
const roomChatPicker = document.getElementById('roomChatPicker');
const roomEmojiGrid = document.getElementById('roomEmojiGrid');
const roomGifPanel = document.getElementById('roomGifPanel');
const roomGifGrid = document.getElementById('roomGifGrid');
const roomGifSearchForm = document.getElementById('roomGifSearchForm');
const roomGifSearchInput = document.getElementById('roomGifSearchInput');
const roomGifSearchStatus = document.getElementById('roomGifSearchStatus');
const roomSelectedGif = document.getElementById('roomSelectedGif');
const roomSelectedGifImage = document.getElementById('roomSelectedGifImage');
const roomEmojiButton = document.getElementById('roomEmojiButton');
const roomGifButton = document.getElementById('roomGifButton');
const roomMemberHint = document.getElementById('roomMemberHint');
const createRoomModal = document.getElementById('createRoomModal');
const createRoomForm = document.getElementById('createRoomForm');
const createRoomStatus = document.getElementById('createRoomStatus');
const manageRoomButton = document.getElementById('manageRoomButton');
const saveRoomSettingsButton = document.getElementById('saveRoomSettings');
const deleteRoomButton = document.getElementById('deleteRoomButton');
const deleteRoomConfirmModal = document.getElementById('deleteRoomConfirmModal');
const deleteRoomStatus = document.getElementById('deleteRoomStatus');
const confirmDeleteRoomButton = document.getElementById('confirmDeleteRoom');
const storeChatModal = document.getElementById('storeChatModal');
const storeChatForm = document.getElementById('storeChatForm');
const storeChatThread = document.getElementById('storeChatThread');
const chatStoreContext = document.getElementById('chatStoreContext');

const storesStorageKey = 'aethelStores';
const profileStorageKey = 'aethelProfile';
const postsStorageKey = 'aethelDiscoverPosts';
const cloudStatus = document.getElementById('cloudStatus');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileHandle = document.getElementById('profileHandle');
const profileAccountType = document.getElementById('profileAccountType');
const profileSocialLinks = document.getElementById('profileSocialLinks');
const profileSocialLinkFields = document.getElementById('profileSocialLinkFields');
const profileLoginButton = document.getElementById('profileLoginButton');
const profileEditButton = document.getElementById('profileEditButton');
const becomeCreatorButton = document.getElementById('becomeCreatorButton');
const composerAvatar = document.getElementById('composerAvatar');
const firstVisitWelcome = document.getElementById('firstVisitWelcome');
const signupAccountTypeInput = document.getElementById('signupAccountType');
const signupTypeDescription = document.getElementById('signupTypeDescription');
let isAuthenticated = false;
let pendingAccountType = 'creator';

const socialServices = [
  { domains: ['instagram.com'], name: 'Instagram', icon: 'instagram' },
  { domains: ['linkedin.com'], name: 'LinkedIn', icon: 'linkedin' },
  { domains: ['x.com', 'twitter.com'], name: 'X', icon: 'x' },
  { domains: ['tiktok.com'], name: 'TikTok', icon: 'tiktok' },
  { domains: ['youtube.com', 'youtu.be'], name: 'YouTube', icon: 'youtube' },
  { domains: ['facebook.com', 'fb.com'], name: 'Facebook', icon: 'facebook' },
  { domains: ['threads.net'], name: 'Threads', icon: 'threads' },
  { domains: ['behance.net'], name: 'Behance', icon: 'behance' },
  { domains: ['dribbble.com'], name: 'Dribbble', icon: 'dribbble' },
  { domains: ['github.com'], name: 'GitHub', icon: 'github' },
  { domains: ['twitch.tv'], name: 'Twitch', icon: 'twitch' },
  { domains: ['discord.com', 'discordapp.com', 'discord.gg'], name: 'Discord', icon: 'discord' },
  { domains: ['pinterest.com'], name: 'Pinterest', icon: 'pinterest' }
];

const roomEmojis = ['😀', '😂', '🥹', '😍', '🤔', '🙌', '👏', '👍', '👀', '🔥', '🎉', '💯', '❤️', '✨', '🚀', '💜'];
const roomGifs = [
  { id: '1f44b', label: 'Waving hand' },
  { id: '1f44d', label: 'Thumbs up' },
  { id: '1f602', label: 'Laughing face' },
  { id: '1f389', label: 'Party popper' },
  { id: '1f525', label: 'Fire' },
  { id: '1f4af', label: 'Hundred points' },
  { id: '1f64c', label: 'Raising hands' },
  { id: '1f44f', label: 'Clapping hands' }
];
const getRoomGifUrl = (gifId) => roomGifs.some((gif) => gif.id === gifId)
  ? `https://fonts.gstatic.com/s/e/notoemoji/latest/${gifId}/512.gif`
  : '';
const isKlipyGifUrl = (url) => {
  if (typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'static.klipy.com';
  } catch {
    return false;
  }
};
const searchKlipyGifs = httpsCallable(functions, 'searchKlipyGifs');

const readStoredValue = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

let stores = readStoredValue(storesStorageKey, []);
if (!Array.isArray(stores)) stores = [];
let discoverPosts = readStoredValue(postsStorageKey, []);
if (!Array.isArray(discoverPosts)) discoverPosts = [];
let chats = {};
let currentProfile = readStoredValue(profileStorageKey, null);
let editingStoreId = null;
let activeFeedFilter = 'all';
let discoverSearchQuery = '';
let activeChatConversationId = null;
let activeChatUnsubscribe = null;
let activeStorefrontId = null;
let isManagingStorefront = false;
let rooms = [];
let activeRoomId = null;
let activeRoomMessages = [];
let activeRoomMessageUnsubscribe = null;
let selectedRoomGif = '';
let roomGifResults = [];
let roomGifLastQuery = null;
let roomGifSearchSequence = 0;
let roomGifSearchTimer = null;
let isManagingRoom = false;
const inactivityLimitMs = 30 * 60 * 1000;
let inactivityTimeoutId = null;
let monitoredAuthUid = null;
let lastActivityWriteAt = 0;
let signingOutForInactivity = false;

const clearActiveUserSession = () => {
  try {
    localStorage.removeItem(profileStorageKey);
    localStorage.removeItem('aethelWelcomeSeen');
  } catch {}
  currentProfile = null;
  isAuthenticated = false;
};

clearActiveUserSession();

const openModal = (modal) => {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = (modal) => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
};

const createElement = (tagName, className = '', text = '') => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const getSocialService = (value) => {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    return socialServices.find((service) => service.domains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    )) || { name: hostname, icon: '' };
  } catch {
    return null;
  }
};

const getProfileSocialUrls = (profile) => {
  if (Array.isArray(profile?.socialLinks)) return profile.socialLinks;
  return [profile?.instagram, profile?.linkedin, profile?.xProfile, profile?.portfolio].filter(Boolean);
};

const createSocialAnchor = (value) => {
  const service = getSocialService(value);
  if (!service) return null;

  const url = new URL(value);
  const link = createElement('a', 'social-link');
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.title = service.name;
  link.setAttribute('aria-label', `${service.name} profile`);

  if (service.icon) {
    const logo = createElement('img');
    logo.src = `https://cdn.simpleicons.org/${service.icon}`;
    logo.alt = '';
    logo.addEventListener('error', () => {
      logo.replaceWith(createElement('span', 'social-icon-fallback', service.name.charAt(0).toUpperCase()));
    }, { once: true });
    link.append(logo);
  } else {
    link.append(createElement('span', 'social-icon-fallback', service.name.charAt(0).toUpperCase()));
  }

  link.append(createElement('span', 'visually-hidden', service.name));
  return link;
};

const updateSocialLinkPreview = (input, preview) => {
  preview.replaceChildren();
  const service = getSocialService(input.value);
  if (!service) {
    preview.textContent = 'Paste a profile URL';
    return;
  }

  if (service.icon) {
    const logo = createElement('img');
    logo.src = `https://cdn.simpleicons.org/${service.icon}`;
    logo.alt = '';
    preview.append(logo);
  }
  preview.append(createElement('span', '', service.name));
};

const addSocialLinkInput = (value = '', container = profileSocialLinkFields) => {
  const row = createElement('div', 'social-link-field');
  const label = createElement('label');
  label.append(createElement('span', '', 'Profile URL'));
  const input = createElement('input');
  input.type = 'url';
  input.name = 'socialUrl';
  input.className = 'profile-social-input';
  input.value = value;
  label.append(input);

  const preview = createElement('div', 'social-provider-preview');
  updateSocialLinkPreview(input, preview);
  input.addEventListener('input', () => {
    input.setCustomValidity(input.value.trim() && !getSocialService(input.value)
      ? 'Enter a valid HTTP or HTTPS profile URL.'
      : '');
    updateSocialLinkPreview(input, preview);
  });

  const removeButton = createElement('button', 'remove-social-link', 'Remove');
  removeButton.type = 'button';
  removeButton.setAttribute('aria-label', 'Remove social link');
  removeButton.addEventListener('click', () => row.remove());
  row.append(label, preview, removeButton);
  container.append(row);
};

const renderProfileArea = () => {
  const name = currentProfile?.fullName?.trim() || 'Your profile';
  const initials = name === 'Your profile' ? '?' : name.charAt(0).toUpperCase();
  profileName.textContent = name;
  profileHandle.textContent = currentProfile?.username || currentProfile?.role || 'Sign in to set up your creator profile';
  profileAccountType.textContent = currentProfile?.accountType === 'shopper' ? 'Shopper' : 'Creator';
  profileAccountType.classList.toggle('hidden', !currentProfile?.accountType);

  [profileAvatar, composerAvatar].forEach((avatar) => {
    avatar.replaceChildren();
    if (currentProfile?.profilePicture) {
      const image = createElement('img');
      image.src = currentProfile.profilePicture;
      image.alt = '';
      avatar.append(image);
      avatar.classList.add('has-profile-photo');
    } else {
      avatar.textContent = initials;
      avatar.classList.remove('has-profile-photo');
    }
  });

  profileSocialLinks.replaceChildren();
  getProfileSocialUrls(currentProfile).forEach((url) => {
    const link = createSocialAnchor(url);
    if (link) profileSocialLinks.append(link);
  });

  profileLoginButton.classList.toggle('hidden', isAuthenticated);
  profileEditButton.classList.toggle('hidden', !isAuthenticated);
  becomeCreatorButton.classList.toggle('hidden', !isAuthenticated || currentProfile?.accountType !== 'shopper');
};

const setSignupAccountType = (accountType) => {
  pendingAccountType = accountType === 'shopper' ? 'shopper' : 'creator';
  signupAccountTypeInput.value = pendingAccountType;
  const isCreator = pendingAccountType === 'creator';
  document.getElementById('creatorSignupFields').classList.toggle('hidden', !isCreator);
  document.getElementById('creatorSpecialtiesField').classList.toggle('hidden', !isCreator);
  document.querySelectorAll('[data-signup-type]').forEach((button) => {
    button.classList.toggle('active', button.dataset.signupType === pendingAccountType);
  });
  signupTypeDescription.textContent = pendingAccountType === 'shopper'
    ? 'Set up a shopper profile to discover independent services and storefronts.'
    : 'Set up your creator profile and share what you make.';
};

const showCloudError = (error) => {
  console.error('Firebase operation failed:', error);
  cloudStatus.textContent = `Cloud save failed: ${error.message || 'Check your Firebase setup and try again.'}`;
  cloudStatus.classList.remove('hidden');
};

const clearCloudStatus = () => {
  cloudStatus.textContent = '';
  cloudStatus.classList.add('hidden');
};

const activityStorageKey = (uid) => `aethelLastActivity:${uid}`;

const getLastActivityAt = (uid) => {
  try {
    const timestamp = Number(localStorage.getItem(activityStorageKey(uid)));
    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
  } catch (error) {
    showCloudError(error);
    return lastActivityWriteAt || Date.now();
  }
};

const writeLastActivityAt = (uid, timestamp) => {
  try {
    localStorage.setItem(activityStorageKey(uid), String(timestamp));
    lastActivityWriteAt = timestamp;
  } catch (error) {
    lastActivityWriteAt = timestamp;
    showCloudError(error);
  }
};

const scheduleInactivitySignOut = (uid) => {
  window.clearTimeout(inactivityTimeoutId);
  if (auth.currentUser?.uid !== uid) return;
  const lastActivityAt = getLastActivityAt(uid) || Date.now();
  const remainingMs = inactivityLimitMs - (Date.now() - lastActivityAt);
  inactivityTimeoutId = window.setTimeout(async () => {
    if (auth.currentUser?.uid !== uid) return;
    const latestActivityAt = getLastActivityAt(uid) || lastActivityAt;
    if (Date.now() - latestActivityAt < inactivityLimitMs) {
      scheduleInactivitySignOut(uid);
      return;
    }
    signingOutForInactivity = true;
    try {
      await signOut(auth);
    } catch (error) {
      signingOutForInactivity = false;
      showCloudError(error);
    }
  }, Math.max(0, remainingMs));
};

const startInactivityMonitor = (user) => {
  const now = Date.now();
  const previousActivityAt = getLastActivityAt(user.uid);
  if (previousActivityAt && now - previousActivityAt >= inactivityLimitMs) {
    signingOutForInactivity = true;
    signOut(auth).catch((error) => {
      signingOutForInactivity = false;
      showCloudError(error);
    });
    return false;
  }
  monitoredAuthUid = user.uid;
  if (!previousActivityAt) writeLastActivityAt(user.uid, now);
  lastActivityWriteAt = previousActivityAt || now;
  scheduleInactivitySignOut(user.uid);
  return true;
};

const stopInactivityMonitor = () => {
  window.clearTimeout(inactivityTimeoutId);
  inactivityTimeoutId = null;
  const previousUid = monitoredAuthUid;
  monitoredAuthUid = null;
  lastActivityWriteAt = 0;
  if (!previousUid) return;
  try {
    localStorage.removeItem(activityStorageKey(previousUid));
  } catch (error) {
    showCloudError(error);
  }
};

const recordUserActivity = () => {
  const user = auth.currentUser;
  if (!isAuthenticated || !user || user.uid !== monitoredAuthUid) return;
  const now = Date.now();
  if (now - lastActivityWriteAt >= 10_000) writeLastActivityAt(user.uid, now);
  scheduleInactivitySignOut(user.uid);
};

['pointerdown', 'keydown', 'scroll', 'touchstart', 'input', 'visibilitychange'].forEach((eventName) => {
  document.addEventListener(eventName, recordUserActivity, { passive: true });
});

window.addEventListener('storage', (event) => {
  if (!monitoredAuthUid || event.key !== activityStorageKey(monitoredAuthUid)) return;
  const timestamp = Number(event.newValue);
  if (Number.isFinite(timestamp) && timestamp > 0) {
    lastActivityWriteAt = timestamp;
    scheduleInactivitySignOut(monitoredAuthUid);
  }
});

const getAuthErrorMessage = (error, action) => {
  if (
    action === 'sign in'
    && ['auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(error.code)
  ) {
    return 'Account does not exist, Please sign up';
  }
  if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
    return `Unable to ${action}: enable Email/Password under Firebase Console → Authentication → Sign-in method for project aethel-30d56.`;
  }
  if (error.code === 'auth/invalid-api-key') {
    return `Unable to ${action}: verify the Firebase web API key in firebase.js matches project aethel-30d56.`;
  }
  return `Unable to ${action}: ${error.message}`;
};

const writeOwnedDocuments = async (collectionName, items) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to save changes to Firebase.');
  const ownedItems = items.filter((item) => item.ownerUid === user.uid);
  await Promise.all(ownedItems.map((item) => {
    const publicItem = Object.fromEntries(
      Object.entries(item).filter(([key]) => !['fullName', 'email', 'creatorName', 'senderName'].includes(key))
    );
    if (collectionName === 'posts' && typeof publicItem.creatorUsername !== 'string') {
      publicItem.creatorUsername = currentProfile?.username || 'Creator';
    }
    return setDoc(
      doc(db, collectionName, item.id),
      { ...publicItem, updatedAt: serverTimestamp() }
    );
  }));
};

const migrateLegacyPublicNames = async (userId, username) => {
  const ownedRecords = await Promise.all([
    getDocs(query(collection(db, 'posts'), where('ownerUid', '==', userId))),
    getDocs(query(collection(db, 'stores'), where('ownerUid', '==', userId))),
    getDocs(query(collection(db, 'rooms'), where('ownerUid', '==', userId))),
    getDocs(collection(db, 'rooms'))
  ]);
  const roomMessages = await Promise.all(ownedRecords[3].docs.map((room) => getDocs(
    query(collection(db, 'rooms', room.id, 'messages'), where('senderUid', '==', userId))
  )));
  const migrations = [];
  [ownedRecords[0], ownedRecords[1]].forEach((records) => records.docs.forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'creatorName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        creatorName: deleteField(),
        creatorUsername: username || data.creatorUsername || 'Aethel creator'
      }));
    }
  }));
  ownedRecords[2].docs.forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'creatorName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        creatorName: deleteField(),
        creatorUsername: username || data.creatorUsername || 'Aethel creator'
      }));
    }
  });
  roomMessages.flatMap((messages) => messages.docs).forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'senderName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        senderName: deleteField(),
        senderUsername: username || data.senderUsername || 'Aethel member'
      }));
    }
  });
  await Promise.all(migrations);
};

const saveStores = (items = stores) => {
  const savePromise = writeOwnedDocuments('stores', items);
  savePromise.catch(showCloudError);
  return savePromise;
};

const saveProfile = () => {
  const user = auth.currentUser;
  if (!user || !currentProfile) return Promise.reject(new Error('Sign in to save your profile.'));
  return setDoc(doc(db, 'profiles', user.uid), {
    ...currentProfile,
    uid: user.uid,
    updatedAt: serverTimestamp()
  });
};

const saveDiscoverPosts = () => {
  const savePromise = writeOwnedDocuments('posts', discoverPosts);
  savePromise.catch(showCloudError);
  return savePromise;
};

const renderPostStoreOptions = () => {
  const selectedStoreId = postStorefrontSelect.value;
  postStorefrontSelect.replaceChildren(createElement('option', '', 'No storefront selected'));
  postStorefrontSelect.options[0].value = '';

  stores.forEach((store) => {
    const option = createElement('option', '', `${store.name} · ${store.category}`);
    option.value = store.id;
    postStorefrontSelect.append(option);
  });

  if (stores.some((store) => store.id === selectedStoreId)) {
    postStorefrontSelect.value = selectedStoreId;
  }

  document.getElementById('postStoreHint').textContent = stores.length
    ? 'Link a storefront to give viewers a direct shopping button.'
    : 'Create a storefront first to add a direct shopping button.';
};

const renderRooms = () => {
  roomList.replaceChildren();
  const matchingRooms = rooms.filter((room) => (
    `${room.title || ''} ${room.description || ''} ${room.creatorUsername || ''}`
      .toLowerCase()
      .includes(discoverSearchQuery)
  ));
  if (!matchingRooms.length) {
    roomList.append(createElement(
      'div',
      'empty-room-card',
      discoverSearchQuery ? 'No chat rooms match your search.' : 'No chat rooms yet. Create one to start a conversation.'
    ));
    return;
  }
  matchingRooms.forEach((room) => {
    const card = createElement('button', 'room-card');
    card.type = 'button';
    card.dataset.roomId = room.id;
    const cover = createElement('span', 'room-card-cover');
    if (room.banner) {
      const image = createElement('img');
      image.src = room.banner;
      image.alt = '';
      cover.append(image);
    } else {
      cover.append(createElement('span', 'room-card-initial', (room.title || 'R').charAt(0).toUpperCase()));
    }
    const copy = createElement('span', 'room-card-copy');
    copy.append(createElement('strong', '', room.title || 'Untitled room'));
    copy.append(createElement('span', '', room.description || 'Aethel community chat room'));
    copy.append(createElement('small', '', `Created by ${room.creatorUsername || 'Aethel creator'}`));
    card.append(cover, copy, createElement('span', 'room-card-arrow', '↗'));
    roomList.append(card);
  });
};

const renderRoomMessages = () => {
  roomMessageList.replaceChildren();
  if (!activeRoomMessages.length) {
    roomMessageList.append(createElement('p', 'store-chat-empty', 'Be the first to start the conversation.'));
    return;
  }
  activeRoomMessages.forEach((message) => {
    const bubble = createElement(
      'article',
      `chat-message${message.senderUid === auth.currentUser?.uid ? ' mine' : ''}`
    );
    bubble.append(createElement('strong', 'room-message-author', message.senderUsername || 'Aethel member'));
    const gifUrl = isKlipyGifUrl(message.gifUrl) ? message.gifUrl : getRoomGifUrl(message.gifId);
    if (gifUrl) {
      const image = createElement('img', 'room-chat-gif');
      image.src = gifUrl;
      image.alt = message.gifTitle || 'Animated reaction';
      image.loading = 'lazy';
      bubble.append(image);
    }
    if (message.text) bubble.append(createElement('p', '', message.text));
    const timestamp = message.createdAt?.toDate?.()
      ? message.createdAt.toDate()
      : new Date(message.createdAt || Date.now());
    bubble.append(createElement('time', '', timestamp.toLocaleString()));
    roomMessageList.append(bubble);
  });
  roomMessageList.scrollTop = roomMessageList.scrollHeight;
};

const loadRoomGifs = async (queryText = '') => {
  const requestSequence = ++roomGifSearchSequence;
  roomGifSearchStatus.textContent = queryText ? 'Searching KLIPY...' : 'Loading trending GIFs...';
  roomGifGrid.replaceChildren();
  try {
    const response = await searchKlipyGifs({ query: queryText });
    if (requestSequence !== roomGifSearchSequence) return;
    roomGifResults = (Array.isArray(response.data?.gifs) ? response.data.gifs : [])
      .filter((gif) => gif && typeof gif.id === 'string' && isKlipyGifUrl(gif.url));
    roomGifResults.forEach((gif) => {
      const button = createElement('button', 'room-gif-option');
      button.type = 'button';
      button.dataset.chatGif = gif.id;
      button.setAttribute('aria-label', `Select ${gif.title || 'GIF'}`);
      const image = createElement('img');
      image.src = gif.url;
      image.alt = '';
      image.loading = 'lazy';
      button.append(image, createElement('span', '', gif.title || 'GIF'));
      roomGifGrid.append(button);
    });
    roomGifSearchStatus.textContent = roomGifResults.length
      ? `${roomGifResults.length} GIFs from KLIPY`
      : 'No GIFs found. Try another search.';
    roomGifLastQuery = queryText;
  } catch (error) {
    if (requestSequence !== roomGifSearchSequence) return;
    roomGifResults = [];
    roomGifLastQuery = null;
    roomGifSearchStatus.textContent = `Unable to load KLIPY GIFs: ${error.message}`;
  }
};

const openRoomPage = (room) => {
  activeRoomId = room.id;
  isManagingRoom = false;
  const isOwner = Boolean(auth.currentUser && room.ownerUid === auth.currentUser.uid);
  manageRoomButton.classList.toggle('hidden', !isOwner);
  manageRoomButton.setAttribute('aria-expanded', 'false');
  manageRoomButton.textContent = 'Manage room';
  roomManager.classList.add('hidden');
  roomHero.classList.toggle('has-banner', Boolean(room.banner));
  roomBanner.classList.toggle('hidden', !room.banner);
  if (room.banner) roomBanner.src = room.banner;
  roomPageTitle.textContent = room.title || 'Untitled room';
  roomPageDescription.textContent = room.description || 'Join the conversation.';
  roomCreatorName.textContent = `Created by ${room.creatorUsername || 'Aethel creator'}`;
  roomTitleInput.value = room.title || '';
  roomDescriptionInput.value = room.description || '';
  roomBannerInput.value = '';
  roomStatus.textContent = '';
  roomStatus.classList.remove('error');
  roomMemberHint.textContent = isAuthenticated ? 'Messages are shared with everyone in this room' : 'Sign in to send messages';
  selectedRoomGif = '';
  roomGifSearchInput.value = '';
  roomGifLastQuery = null;
  roomSelectedGif.classList.add('hidden');
  roomMessageInput.value = '';
  roomChatPicker.classList.add('hidden');
  roomEmojiButton.setAttribute('aria-expanded', 'false');
  roomGifButton.setAttribute('aria-expanded', 'false');
  roomGifGrid.replaceChildren();
  closeModal(createRoomModal);
  roomPage.classList.remove('hidden');
  roomPage.setAttribute('aria-hidden', 'false');

  if (activeRoomMessageUnsubscribe) activeRoomMessageUnsubscribe();
  activeRoomMessages = [];
  renderRoomMessages();
  activeRoomMessageUnsubscribe = onSnapshot(
    query(collection(db, 'rooms', room.id, 'messages')),
    (snapshot) => {
      activeRoomMessages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => {
          const first = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const second = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return first - second;
        });
      renderRoomMessages();
    },
    showCloudError
  );
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const renderStores = () => {
  storeList.replaceChildren();
  renderPostStoreOptions();

  if (!stores.length) {
    storeList.append(createElement(
      'div',
      'empty-state',
      'No storefronts yet. Create one to build your creator page.'
    ));
    return;
  }

  stores.forEach((store, index) => {
    const card = createElement('button', 'store-item');
    card.type = 'button';
    card.dataset.storeId = store.id;
    card.setAttribute('aria-label', `View ${store.name} storefront`);

    const art = createElement('span', `store-art art-${(index % 4) + 1}`);
    const cover = store.media?.[0]?.data || store.projectImages?.[0];
    if (cover && (!store.media?.[0]?.type || store.media[0].type.startsWith('image/'))) {
      const image = createElement('img');
      image.src = cover;
      image.alt = '';
      art.append(image);
    }
    const copy = createElement('span', 'store-copy');
    const header = createElement('span', 'store-header');
    header.append(createElement('strong', '', store.name));
    header.append(createElement('span', '', store.draft ? 'Draft' : store.category || 'Creator page'));
    copy.append(header);
    copy.append(createElement('span', 'store-handle', store.handle));
    if (store.bio) copy.append(createElement('span', 'store-handle', store.bio));

    card.append(art, copy);
    storeList.append(card);
  });
};

let mediaObserver;

const createDiscoverPostCard = (post) => {
  const card = createElement('article', `discover-post${post.type === 'ad' ? ' sponsored-post' : ''}`);
  card.dataset.postId = post.id;
  const media = createElement('div', 'discover-post-media');

  if (post.mediaType.startsWith('video/')) {
    const video = createElement('video');
    video.src = post.mediaData;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', 'Creator video');
    media.append(video);
  } else {
    const image = createElement('img');
    image.src = post.mediaData;
    image.alt = 'Creator post';
    image.loading = 'lazy';
    media.append(image);
  }

  const overlay = createElement('div', 'discover-post-overlay');
  const copy = createElement('div', 'discover-post-copy');
  copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
  copy.append(createElement('strong', 'post-creator-name', post.creatorUsername || 'Creator'));
  if (post.creatorUsername) copy.append(createElement('span', 'post-creator-handle', post.creatorUsername));
  copy.append(createElement('p', 'discover-post-caption', post.caption));

  const linkedStore = stores.find((store) => store.id === post.storeId);
  if (linkedStore) {
    const shopButton = createElement('button', 'primary-btn post-shop-button', `Shop ${linkedStore.name}`);
    shopButton.type = 'button';
    shopButton.dataset.shopStoreId = linkedStore.id;
    copy.append(shopButton);
  } else {
    const browseLink = createElement('a', 'secondary-btn post-shop-button', 'Browse storefronts');
    browseLink.href = '#storefronts';
    copy.append(browseLink);
  }

  const actions = createElement('div', 'post-action-rail');
  const likeButton = createElement('button', `post-like-button${post.liked ? ' is-liked' : ''}`);
  likeButton.type = 'button';
  likeButton.dataset.likePostId = post.id;
  likeButton.setAttribute('aria-label', post.liked ? 'Unlike post' : 'Like post');
  likeButton.setAttribute('aria-pressed', String(Boolean(post.liked)));
  likeButton.append(createElement('span', 'post-like-icon', post.liked ? '♥' : '♡'));
  likeButton.append(createElement('span', 'post-like-count', String(post.likes || 0)));
  actions.append(likeButton);

  overlay.append(copy, actions);
  media.append(overlay);
  card.append(media);
  return card;
};

const renderDiscoverFeed = () => {
  const postResults = discoverPosts.filter((post) => {
    const matchesFilter = activeFeedFilter === 'all' || activeFeedFilter === 'post';
    const linkedStore = stores.find((store) => store.id === post.storeId);
    const searchableText = [
      post.caption,
      post.creatorUsername,
      linkedStore?.name,
      linkedStore?.handle,
      linkedStore?.category,
      linkedStore?.bio
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesFilter && searchableText.includes(discoverSearchQuery);
  });
  if (activeFeedFilter === 'rooms') {
    renderRooms();
    projectRoomsPanel.classList.remove('hidden');
    discoverFeed.classList.add('rooms-mode');
    discoverFeed.replaceChildren(projectRoomsPanel);
    const matchingRoomCount = rooms.filter((room) => (
      `${room.title || ''} ${room.description || ''} ${room.creatorUsername || ''}`
        .toLowerCase()
        .includes(discoverSearchQuery)
    )).length;
    discoverSearchStatus.textContent = `${matchingRoomCount} ${matchingRoomCount === 1 ? 'room' : 'rooms'} found`;
    clearDiscoverSearch.classList.toggle('hidden', !discoverSearchQuery);
    if (mediaObserver) mediaObserver.disconnect();
    return;
  }

  discoverFeed.classList.remove('rooms-mode');
  const visibleItems = postResults;
  const cards = visibleItems.map(createDiscoverPostCard);
  discoverFeed.replaceChildren(...cards);

  if (!visibleItems.length) {
    const heading = feedEmptyState.querySelector('h2');
    const message = feedEmptyState.querySelector('p');
    if (discoverSearchQuery) {
      heading.textContent = `No results for "${discoverSearchInput.value.trim()}"`;
      message.textContent = 'Try another search or clear your filters.';
    } else {
      heading.textContent = discoverPosts.length ? 'No projects yet' : 'Your Discover feed is ready';
      message.textContent = discoverPosts.length
        ? 'Publish a project to be the first in this feed.'
        : 'Share a project, promote an offer, and link it to a storefront so people can shop.';
    }
    discoverFeed.append(feedEmptyState);
  }

  discoverSearchStatus.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? 'project' : 'projects'} found`;
  clearDiscoverSearch.classList.toggle('hidden', !discoverSearchQuery);

  if (mediaObserver) mediaObserver.disconnect();
  if ('IntersectionObserver' in window) {
    mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.65 });
    discoverFeed.querySelectorAll('video').forEach((video) => mediaObserver.observe(video));
  }
};

const renderStorefrontPage = (store) => {
  activeStorefrontId = store.id;
  const isOwner = Boolean(
    isAuthenticated
    && auth.currentUser
    && store.ownerUid === auth.currentUser.uid
  );
  const editor = document.querySelector('.storefront-editor');
  if (!isOwner) isManagingStorefront = false;
  manageStorefrontButton.classList.toggle('hidden', !isOwner);
  manageStorefrontButton.setAttribute('aria-expanded', String(isOwner && isManagingStorefront));
  manageStorefrontButton.textContent = isManagingStorefront ? 'Done managing' : 'Manage storefront';
  editor.classList.toggle('hidden', !isOwner || !isManagingStorefront);
  storefrontCreatePost.classList.toggle('hidden', !isOwner || !isManagingStorefront);
  storefrontMessageButton.classList.toggle('hidden', isOwner);
  storefrontMessageButton.dataset.messageStoreId = store.id;

  document.getElementById('storeTemplateTitle').textContent = store.name;
  document.getElementById('storefrontHandle').textContent = store.handle || '';
  const storefrontSocialUrls = store.socialLinks?.length
    ? store.socialLinks
    : isOwner
      ? getProfileSocialUrls(currentProfile)
      : [];
  storefrontSocials.replaceChildren();
  (Array.isArray(storefrontSocialUrls) ? storefrontSocialUrls : [])
    .map(createSocialAnchor)
    .filter(Boolean)
    .forEach((link) => storefrontSocials.append(link));
  storefrontSocials.classList.toggle('hidden', !storefrontSocials.childElementCount);
  storefrontBio.textContent = store.bio || 'This creator has not added a bio yet.';
  storefrontHero.classList.toggle('has-banner', Boolean(store.banner));
  storefrontBanner.classList.toggle('hidden', !store.banner);
  if (store.banner) storefrontBanner.src = store.banner;
  storefrontLogo.replaceChildren();
  if (store.logo) {
    const logoImage = createElement('img');
    logoImage.src = store.logo;
    logoImage.alt = `${store.name} logo`;
    storefrontLogo.append(logoImage);
  } else {
    storefrontLogo.textContent = store.name.charAt(0).toUpperCase();
  }

  const posts = discoverPosts.filter((post) => (
    post.storeId === store.id
    || (store.ownerUid && post.ownerUid === store.ownerUid)
  ));
  storefrontPosts.replaceChildren();
  if (!posts.length) {
    storefrontPosts.append(createElement(
      'p',
      'storefront-posts-empty',
      isOwner ? 'Your work and posts will appear here. Publish a post to start building your portfolio.' : 'No posts have been shared here yet.'
    ));
  } else {
    posts.forEach((post) => {
      const card = createElement('article', 'storefront-post-card');
      const media = post.mediaType?.startsWith('video/')
        ? createElement('video', 'storefront-post-media')
        : createElement('img', 'storefront-post-media');
      media.src = post.mediaData;
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.playsInline = true;
      } else {
        media.alt = `${store.name} project`;
        media.loading = 'lazy';
      }
      const copy = createElement('div', 'storefront-post-copy');
      copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
      copy.append(createElement('p', '', post.caption || 'Project from the creator'));
      card.append(media, copy);
      storefrontPosts.append(card);
    });
  }

  storeTemplateForm.elements.storeId.value = store.id;
  storeTemplateForm.elements.storeBio.value = store.bio || '';
  storefrontBioEditor.classList.add('hidden');
  storefrontBioAction.setAttribute('aria-expanded', 'false');
  storefrontBioAction.querySelector('.upload-plus').textContent = '+';
  storefrontBioActionLabel.textContent = store.bio ? 'Edit Bio' : 'Add Bio';
  storeLogoInput.value = '';
  storeBannerInput.value = '';
  storeTemplateMedia.value = '';
  storeTemplateSocialLinks.replaceChildren();
  storefrontSocialUrls.forEach((url) => addSocialLinkInput(url, storeTemplateSocialLinks));
  const existingMedia = store.media?.length
    ? store.media
    : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
  renderStoreTemplateMedia(existingMedia);
  storeTemplateStatus.textContent = '';
  storeTemplateStatus.classList.remove('error');
  storefrontHero.dataset.storeId = store.id;
};

const renderStoreDetails = (store) => {
  storeDetailContent.replaceChildren();

  const header = createElement('div', 'detail-heading');
  header.append(createElement('div', 'brand-mark small-brand', store.name.charAt(0).toUpperCase()));
  const headingCopy = createElement('div');
  headingCopy.append(createElement('h2', '', store.name));
  if (store.handle) headingCopy.append(createElement('p', 'detail-handle', store.handle));
  header.append(headingCopy);
  storeDetailContent.append(header);
  storeDetailContent.append(createElement('h3', 'detail-section-title', 'About'));
  storeDetailContent.append(createElement('p', 'detail-bio', store.bio || 'This creator has not added a bio yet.'));

  const mediaItems = store.media?.length
    ? store.media
    : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
  storeDetailContent.append(createElement('h3', 'detail-section-title', 'Photos and videos'));
  if (mediaItems.length) {
    const gallery = createElement('div', 'storefront-media-gallery');
    mediaItems.forEach((item, index) => {
      const mediaItem = createElement('div', 'storefront-media-item');
      const media = createElement(item.type.startsWith('video/') ? 'video' : 'img');
      media.src = item.data;
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.playsInline = true;
      } else {
        media.alt = `${store.name} media ${index + 1}`;
      }
      mediaItem.append(media);
      gallery.append(mediaItem);
    });
    storeDetailContent.append(gallery);
  } else {
    storeDetailContent.append(createElement('p', 'storefront-media-empty', 'Photos and videos will appear here.'));
  }

  const socialUrls = Array.isArray(store.socialLinks) ? store.socialLinks : getProfileSocialUrls(currentProfile);
  const contactLinks = socialUrls
    .map(createSocialAnchor)
    .filter(Boolean);

  storeDetailContent.append(createElement('h3', 'detail-section-title', 'Social links'));
  const links = createElement('div', 'social-links');
  if (contactLinks.length) links.append(...contactLinks);
  else links.append(createElement('p', 'storefront-media-empty', 'No social links added yet.'));
  storeDetailContent.append(links);

  const messageButton = createElement('button', 'primary-btn full-width storefront-message-button', 'Start live chat with the creator');
  messageButton.type = 'button';
  messageButton.dataset.messageStoreId = store.id;
  storeDetailContent.append(messageButton);
};

const renderStoreChat = () => {
  storeChatThread.replaceChildren();
  const messages = chats[activeChatConversationId] || [];
  if (!messages.length) {
    storeChatThread.append(createElement('p', 'store-chat-empty', 'Start a conversation about this storefront.'));
    return;
  }

  messages.forEach((message) => {
    const bubble = createElement('div', `chat-message${message.senderUid === auth.currentUser?.uid ? ' mine' : ''}`);
    bubble.append(createElement('p', '', message.text));
    const createdAt = message.createdAt?.toDate ? message.createdAt.toDate() : new Date(message.createdAt);
    bubble.append(createElement('time', '', createdAt.toLocaleString()));
    storeChatThread.append(bubble);
  });
  storeChatThread.scrollTop = storeChatThread.scrollHeight;
};

const openStoreChat = (store) => {
  if (!requireAuth('signin')) return;
  activeChatConversationId = `${store.id}_${auth.currentUser.uid}`;
  const conversationRef = doc(db, 'chats', activeChatConversationId);
  const participants = [...new Set([auth.currentUser.uid, store.ownerUid].filter(Boolean))];
  setDoc(conversationRef, { storeId: store.id, participants }, { merge: true })
    .then(() => {
      if (activeChatUnsubscribe) activeChatUnsubscribe();
      activeChatUnsubscribe = onSnapshot(
        query(collection(db, 'chats', activeChatConversationId, 'messages')),
        (snapshot) => {
          chats[activeChatConversationId] = snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) => {
              const first = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const second = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return first - second;
            });
          renderStoreChat();
        },
        showCloudError
      );
    })
    .catch(showCloudError);
  document.getElementById('storeChatTitle').textContent = `Chat with ${store.name}`;
  chatStoreContext.textContent = `${store.handle} · ${store.category}`;
  renderStoreChat();
  closeModal(storeDetailModal);
  closeModal(storeTemplateModal);
  openModal(storeChatModal);
};

const renderManagedStores = () => {
  managedStoreList.replaceChildren();
  const ownedStores = stores.filter((store) => store.ownerUid === auth.currentUser?.uid);
  if (!ownedStores.length) {
    managedStoreList.append(createElement('p', 'empty-state', 'You have no storefronts to manage yet.'));
    return;
  }

  ownedStores.forEach((store) => {
    const row = createElement('div', 'managed-store-row');
    const description = createElement('div', 'managed-store-copy');
    description.append(createElement('strong', '', store.name));
    description.append(createElement('span', '', `${store.handle} · ${store.category}`));
    const actions = createElement('div', 'managed-store-actions');
    const editButton = createElement('button', 'secondary-btn', 'Edit');
    editButton.type = 'button';
    editButton.dataset.editStore = store.id;
    const deleteButton = createElement('button', 'ghost-btn danger-btn', 'Delete');
    deleteButton.type = 'button';
    deleteButton.dataset.deleteStore = store.id;
    actions.append(editButton, deleteButton);
    row.append(description, actions);
    managedStoreList.append(row);
  });
};

const renderManagedPosts = () => {
  managedPostList.replaceChildren();
  const creatorPosts = discoverPosts.filter((post) => (
    post.ownerUid === auth.currentUser?.uid
  ));

  if (!creatorPosts.length) {
    managedPostList.append(createElement('p', 'empty-state', 'You have no posts to manage yet.'));
    return;
  }

  creatorPosts.forEach((post) => {
    const row = createElement('div', 'managed-post-row');
    const preview = post.mediaType.startsWith('video/')
      ? createElement('video', 'managed-post-preview')
      : createElement('img', 'managed-post-preview');
    preview.src = post.mediaData;
    if (preview.tagName === 'VIDEO') {
      preview.muted = true;
      preview.playsInline = true;
      preview.preload = 'metadata';
    } else {
      preview.alt = 'Post media preview';
    }

    const copy = createElement('div', 'managed-post-copy');
    copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
    copy.append(createElement('p', '', post.caption));
    const deleteButton = createElement('button', 'ghost-btn danger-btn', 'Delete');
    deleteButton.type = 'button';
    deleteButton.dataset.deletePost = post.id;
    row.append(preview, copy, deleteButton);
    managedPostList.append(row);
  });
};

const readImageFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Unable to read image file'));
  reader.readAsDataURL(file);
});

const uploadDataUrl = async (path, dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob, { contentType: blob.type });
  return getDownloadURL(fileRef);
};

const uploadMediaItem = async (storeId, item, index) => ({
  ...item,
  data: await uploadDataUrl(
    `users/${auth.currentUser.uid}/stores/${storeId}/media/${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`}`,
    item.data
  )
});

let templatePreviewUrls = [];

const renderStoreTemplateMedia = (mediaItems) => {
  templatePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  templatePreviewUrls = [];
  storeTemplateMediaPreview.replaceChildren();

  mediaItems.slice(0, 6).forEach((item) => {
    const isFile = item instanceof File;
    const type = isFile ? item.type : item.type;
    const src = isFile ? URL.createObjectURL(item) : item.data;
    if (isFile) templatePreviewUrls.push(src);
    const preview = createElement('div', 'template-media-item');
    const mediaElement = createElement(type.startsWith('video/') ? 'video' : 'img');
    mediaElement.src = src;
    if (mediaElement.tagName === 'VIDEO') {
      mediaElement.muted = true;
      mediaElement.playsInline = true;
      mediaElement.controls = true;
    } else {
      mediaElement.alt = 'Storefront media preview';
    }
    preview.append(mediaElement);
    storeTemplateMediaPreview.append(preview);
  });
};

const openStoreTemplate = (store) => {
  editingStoreId = store.id;
  isManagingStorefront = false;
  closeModal(storeModal);
  closeModal(manageStoresModal);
  closeModal(storeDetailModal);
  renderStorefrontPage(store);
  openModal(storeTemplateModal);
};

const requireAuth = (mode = 'signin') => {
  if (isAuthenticated) return true;
  openModal(loginModal);
  setAuthMode(mode);
  return false;
};

const prepareNewStore = () => {
  if (!requireAuth('signup')) return;
  editingStoreId = null;
  storeForm.reset();
  storeModalTitle.textContent = 'Name your storefront';
  storeSubmitButton.textContent = 'Continue';
  openModal(storeModal);
};

const openPostComposer = () => {
  if (!requireAuth('signup')) return;

  renderPostStoreOptions();
  postUploadStatus.textContent = '';
  postUploadStatus.classList.remove('error');
  openModal(createPostModal);
};

if (postForm) {
  postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(postForm);
    const mediaFile = formData.get('media');

    if (!mediaFile?.size || mediaFile.size > 2 * 1024 * 1024) {
      postUploadStatus.textContent = 'Choose a media file up to 2 MB.';
      postUploadStatus.classList.add('error');
      return;
    }

    if (!mediaFile.type.startsWith('image/') && !['video/mp4', 'video/webm'].includes(mediaFile.type)) {
      postUploadStatus.textContent = 'Use an image, MP4, or WebM video.';
      postUploadStatus.classList.add('error');
      return;
    }

    try {
      const postRef = doc(collection(db, 'posts'));
      const mediaRef = ref(storage, `users/${auth.currentUser.uid}/posts/${postRef.id}/media`);
      await uploadBytes(mediaRef, mediaFile, { contentType: mediaFile.type });
      const mediaData = await getDownloadURL(mediaRef);
      discoverPosts.unshift({
        id: postRef.id,
        type: formData.get('postType').toString(),
        caption: formData.get('caption').toString().trim(),
        mediaType: mediaFile.type,
        mediaData,
        storeId: formData.get('storeId').toString(),
        creatorUsername: currentProfile?.username || '',
        ownerUid: auth.currentUser.uid,
        liked: false,
        likes: 0,
        createdAt: new Date().toISOString()
      });
      await saveDiscoverPosts();
      activeFeedFilter = 'all';
      document.querySelectorAll('[data-feed-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.feedFilter === 'all');
      });
      renderDiscoverFeed();
      if (activeStorefrontId) {
        const activeStore = stores.find((item) => item.id === activeStorefrontId);
        if (activeStore && !storeTemplateModal.classList.contains('hidden')) renderStorefrontPage(activeStore);
      }
      postForm.reset();
      closeModal(createPostModal);
    } catch (error) {
      postUploadStatus.textContent = `Unable to save post: ${error.message}`;
      postUploadStatus.classList.add('error');
    }
  });
}

discoverFeed.addEventListener('click', (event) => {
  const openStoreButton = event.target.closest('[data-open-store-id]');
  if (openStoreButton) {
    const store = stores.find((item) => item.id === openStoreButton.dataset.openStoreId);
    if (store) openStoreTemplate(store);
    return;
  }

  const shopButton = event.target.closest('[data-shop-store-id]');
  if (shopButton) {
    const store = stores.find((item) => item.id === shopButton.dataset.shopStoreId);
    if (store) openStoreTemplate(store);
    return;
  }

  const likeButton = event.target.closest('[data-like-post-id]');
  if (!likeButton) return;
  const post = discoverPosts.find((item) => item.id === likeButton.dataset.likePostId);
  if (!post) return;
  if (!requireAuth('signin')) return;

  post.liked = !post.liked;
  post.likes = Math.max(0, (post.likes || 0) + (post.liked ? 1 : -1));
  likeButton.classList.toggle('is-liked', post.liked);
  likeButton.setAttribute('aria-pressed', String(post.liked));
  likeButton.setAttribute('aria-label', post.liked ? 'Unlike post' : 'Like post');
  likeButton.querySelector('.post-like-icon').textContent = post.liked ? '♥' : '♡';
  likeButton.querySelector('.post-like-count').textContent = String(post.likes);
  updateDoc(doc(db, 'posts', post.id), { liked: post.liked, likes: post.likes }).catch(showCloudError);
  saveDiscoverPosts();
});

let postWheelScrollLocked = false;
discoverFeed.addEventListener('wheel', (event) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(event.deltaY) < 24) return;
  const cards = Array.from(discoverFeed.children)
    .filter((child) => child.matches('.discover-post, .discover-service-card, .empty-feed-card'));
  if (cards.length < 2) return;

  if (postWheelScrollLocked) {
    event.preventDefault();
    return;
  }

  const feedTop = discoverFeed.getBoundingClientRect().top;
  const currentIndex = cards.reduce((closestIndex, card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().top - feedTop);
    const closestDistance = Math.abs(cards[closestIndex].getBoundingClientRect().top - feedTop);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
  const nextIndex = currentIndex + Math.sign(event.deltaY);
  if (!cards[nextIndex]) return;

  event.preventDefault();
  const targetTop = discoverFeed.scrollTop
    + cards[nextIndex].getBoundingClientRect().top
    - feedTop;
  postWheelScrollLocked = true;
  discoverFeed.scrollTo({ top: targetTop, behavior: 'smooth' });
  window.setTimeout(() => { postWheelScrollLocked = false; }, 650);
}, { passive: false });

const prepareStoreEdit = (store) => {
  openStoreTemplate(store);
};

const setAuthenticated = (profile) => {
  isAuthenticated = true;
  currentProfile = profile;
  clearCloudStatus();
  document.getElementById('loginButton').classList.add('hidden');
  document.getElementById('logoutButton').classList.remove('hidden');
  document.getElementById('accountButton').classList.remove('hidden');
  document.getElementById('manageStoresButton').classList.remove('hidden');
  document.getElementById('managePostsButton').classList.remove('hidden');
  const isCreator = currentProfile.accountType !== 'shopper';
  ['newStoreButton', 'newStoreMiniButton', 'openPostModalButton', 'createPostButton', 'feedCreatePost']
    .forEach((id) => document.getElementById(id)?.classList.toggle('hidden', !isCreator));
  renderProfileArea();
  renderManagedStores();
  renderManagedPosts();
};

const setLoggedOut = () => {
  isAuthenticated = false;
  currentProfile = null;
  stopInactivityMonitor();
  if (activeChatUnsubscribe) {
    activeChatUnsubscribe();
    activeChatUnsubscribe = null;
  }
  activeChatConversationId = null;
  if (roomPage && !roomPage.classList.contains('hidden')) {
    roomMemberHint.textContent = 'Sign in to send messages';
    manageRoomButton.classList.add('hidden');
    roomManager.classList.add('hidden');
    isManagingRoom = false;
  }
  try {
    localStorage.removeItem(profileStorageKey);
    localStorage.removeItem('aethelWelcomeSeen');
  } catch {}
  document.getElementById('loginButton').classList.remove('hidden');
  document.getElementById('logoutButton').classList.add('hidden');
  document.getElementById('accountButton').classList.add('hidden');
  document.getElementById('manageStoresButton').classList.add('hidden');
  document.getElementById('managePostsButton').classList.add('hidden');
  ['newStoreButton', 'newStoreMiniButton', 'openPostModalButton', 'createPostButton', 'feedCreatePost']
    .forEach((id) => document.getElementById(id)?.classList.add('hidden'));
  renderProfileArea();
  if (activeStorefrontId) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
};

const openAccountSettings = () => {
  if (!requireAuth('signin')) return;
  accountForm.elements.fullName.value = currentProfile?.fullName || '';
  accountForm.elements.username.value = currentProfile?.username || '';
  accountForm.elements.email.value = currentProfile?.email || '';
  accountForm.elements.role.value = currentProfile?.role || 'Web designer';
  accountForm.elements.focus.value = currentProfile?.focus || 'Landing pages';
  profileSocialLinkFields.replaceChildren();
  const socialUrls = getProfileSocialUrls(currentProfile);
  (socialUrls.length ? socialUrls : ['']).forEach((url) => addSocialLinkInput(url, profileSocialLinkFields));
  document.getElementById('accountSaveStatus').textContent = '';
  passwordResetForm.reset();
  passwordResetStatus.textContent = '';
  openModal(accountModal);
};

const setAuthMode = (mode) => {
  const isSignup = mode === 'signup';

  if (authTitle) {
    authTitle.textContent = isSignup
      ? `Join Aethel as a ${pendingAccountType}`
      : 'Welcome back';
  }

  if (isSignup) signupAccountTypeInput.value = pendingAccountType;
  if (authFooterText) {
    authFooterText.innerHTML = isSignup
      ? 'Already have an account? <a href="#" id="loginModeLink">Sign in</a>'
      : 'Need an account? <a href="#" id="createAccountLink">Create one</a>';
  }

  const signInPanel = document.getElementById('loginForm');
  const signUpPanel = document.getElementById('signupForm');

  if (signInPanel) signInPanel.classList.toggle('hidden', isSignup);
  if (signUpPanel) signUpPanel.classList.toggle('hidden', !isSignup);

  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle('active', isActive);
  });

  const footerLink = document.getElementById(isSignup ? 'loginModeLink' : 'createAccountLink');
  if (footerLink) {
    footerLink.addEventListener('click', (event) => {
      event.preventDefault();
      setAuthMode(isSignup ? 'signin' : 'signup');
    });
  }
};

const bindLoginModal = () => {
  if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => closeModal(loginModal));
  }

  if (loginModal) {
    loginModal.addEventListener('click', (event) => {
      if (event.target === loginModal) closeModal(loginModal);
    });
  }

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
  });

  topActions.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.id === 'loginButton') {
      openModal(loginModal);
      setAuthMode('signin');
    } else if (button.id === 'logoutButton') {
      signOut(auth).catch(showCloudError);
    } else if (button.id === 'accountButton') {
      openAccountSettings();
    } else if (button.id === 'manageStoresButton') {
      if (!requireAuth('signin')) return;
      renderManagedStores();
      openModal(manageStoresModal);
    } else if (button.id === 'managePostsButton') {
      if (!requireAuth('signin')) return;
      renderManagedPosts();
      openModal(managePostsModal);
    } else if (button.id === 'newStoreButton') {
      prepareNewStore();
    }
  });

  document.querySelectorAll('[data-welcome-type]').forEach((button) => {
    button.addEventListener('click', () => {
      setSignupAccountType(button.dataset.welcomeType);
      try {
        localStorage.setItem('aethelWelcomeSeen', 'true');
      } catch {}
      closeModal(firstVisitWelcome);
      openModal(loginModal);
      setAuthMode('signup');
    });
  });

  document.querySelectorAll('[data-signup-type]').forEach((button) => {
    button.addEventListener('click', () => setSignupAccountType(button.dataset.signupType));
  });

  document.getElementById('addProfileSocialLink').addEventListener('click', () => addSocialLinkInput());
  profileLoginButton.addEventListener('click', () => {
    openModal(loginModal);
    setAuthMode('signin');
  });
  profileEditButton.addEventListener('click', openAccountSettings);
  becomeCreatorButton.addEventListener('click', () => {
    currentProfile = {
      ...currentProfile,
      accountType: 'creator',
      role: currentProfile.role || 'Web designer',
      focus: currentProfile.focus || 'Landing pages'
    };
    saveProfile().catch(showCloudError);
    setAuthenticated(currentProfile);
    prepareNewStore();
  });
  document.getElementById('closePostModal').addEventListener('click', () => closeModal(createPostModal));
  document.getElementById('closeStoreChat').addEventListener('click', () => closeModal(storeChatModal));
  document.getElementById('closeStoreChat').addEventListener('click', () => closeModal(storeChatModal));
  document.getElementById('addStoreSocialLink').addEventListener('click', () => {
    addSocialLinkInput('', storeTemplateSocialLinks);
  });
  document.getElementById('newRoomButton').addEventListener('click', () => {
    if (!requireAuth('signin')) return;
    createRoomStatus.textContent = '';
    createRoomStatus.classList.remove('error');
    createRoomForm.reset();
    openModal(createRoomModal);
  });
  document.getElementById('closeCreateRoom').addEventListener('click', () => closeModal(createRoomModal));
  createRoomModal.addEventListener('click', (event) => {
    if (event.target === createRoomModal) closeModal(createRoomModal);
  });
  roomEmojis.forEach((emoji) => {
    const button = createElement('button', 'room-emoji-option', emoji);
    button.type = 'button';
    button.dataset.chatEmoji = emoji;
    button.setAttribute('aria-label', `Insert ${emoji}`);
    roomEmojiGrid.append(button);
  });
  const openRoomPicker = (tab) => {
    const isOpen = !roomChatPicker.classList.contains('hidden');
    const sameTab = (tab === 'emoji' && !roomEmojiGrid.classList.contains('hidden'))
      || (tab === 'gif' && !roomGifPanel.classList.contains('hidden'));
    if (isOpen && sameTab) {
      roomChatPicker.classList.add('hidden');
      roomEmojiButton.setAttribute('aria-expanded', 'false');
      roomGifButton.setAttribute('aria-expanded', 'false');
      return;
    }
    roomChatPicker.classList.remove('hidden');
    roomEmojiGrid.classList.toggle('hidden', tab !== 'emoji');
    roomGifPanel.classList.toggle('hidden', tab !== 'gif');
    document.querySelectorAll('[data-chat-picker-tab]').forEach((button) => {
      const active = button.dataset.chatPickerTab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    roomEmojiButton.setAttribute('aria-expanded', String(tab === 'emoji'));
    roomGifButton.setAttribute('aria-expanded', String(tab === 'gif'));
    if (tab === 'gif') {
      if (!requireAuth('signin')) {
        roomChatPicker.classList.add('hidden');
        roomGifButton.setAttribute('aria-expanded', 'false');
        return;
      }
      const queryText = roomGifSearchInput.value.trim();
      if (roomGifLastQuery !== queryText) loadRoomGifs(queryText);
    }
  };
  roomEmojiButton.addEventListener('click', () => openRoomPicker('emoji'));
  roomGifButton.addEventListener('click', () => openRoomPicker('gif'));
  roomGifSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!requireAuth('signin')) return;
    loadRoomGifs(roomGifSearchInput.value.trim());
  });
  roomGifSearchInput.addEventListener('input', () => {
    window.clearTimeout(roomGifSearchTimer);
    if (!requireAuth('signin')) return;
    roomGifSearchTimer = window.setTimeout(() => {
      const queryText = roomGifSearchInput.value.trim();
      if (queryText.length >= 2 || queryText.length === 0) loadRoomGifs(queryText);
      else {
        roomGifSearchStatus.textContent = 'Enter at least 2 characters to search.';
        roomGifGrid.replaceChildren();
      }
    }, 400);
  });
  roomChatPicker.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-chat-picker-tab]');
    if (tab) {
      const pickerTab = tab.dataset.chatPickerTab;
      roomEmojiGrid.classList.toggle('hidden', pickerTab !== 'emoji');
      roomGifPanel.classList.toggle('hidden', pickerTab !== 'gif');
      roomChatPicker.querySelectorAll('[data-chat-picker-tab]').forEach((button) => {
        const active = button === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      roomEmojiButton.setAttribute('aria-expanded', String(pickerTab === 'emoji'));
      roomGifButton.setAttribute('aria-expanded', String(pickerTab === 'gif'));
      if (pickerTab === 'gif') {
        if (!requireAuth('signin')) {
          roomChatPicker.classList.add('hidden');
          roomGifButton.setAttribute('aria-expanded', 'false');
          return;
        }
        const queryText = roomGifSearchInput.value.trim();
        if (roomGifLastQuery !== queryText) loadRoomGifs(queryText);
      }
      return;
    }
    const emojiButton = event.target.closest('[data-chat-emoji]');
    if (emojiButton) {
      const input = roomMessageInput;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      input.setRangeText(emojiButton.dataset.chatEmoji, start, end, 'end');
      input.focus();
      return;
    }
    const gifButton = event.target.closest('[data-chat-gif]');
    if (!gifButton) return;
    selectedRoomGif = roomGifResults.find((gif) => gif.id === gifButton.dataset.chatGif) || null;
    if (!selectedRoomGif) return;
    roomSelectedGifImage.src = selectedRoomGif.url;
    roomSelectedGif.classList.remove('hidden');
    roomChatPicker.classList.add('hidden');
    roomEmojiButton.setAttribute('aria-expanded', 'false');
    roomGifButton.setAttribute('aria-expanded', 'false');
    roomMessageInput.focus();
  });
  document.getElementById('removeRoomGif').addEventListener('click', () => {
    selectedRoomGif = '';
    roomSelectedGif.classList.add('hidden');
    roomSelectedGifImage.removeAttribute('src');
  });
  document.addEventListener('click', (event) => {
    if (roomChatPicker.classList.contains('hidden')) return;
    if (event.target.closest('.room-chat-composer')) return;
    roomChatPicker.classList.add('hidden');
    roomEmojiButton.setAttribute('aria-expanded', 'false');
    roomGifButton.setAttribute('aria-expanded', 'false');
  });
  roomList.addEventListener('click', (event) => {
    const card = event.target.closest('[data-room-id]');
    const room = rooms.find((item) => item.id === card?.dataset.roomId);
    if (room) openRoomPage(room);
  });
  document.getElementById('closeRoomPage').addEventListener('click', () => {
    roomPage.classList.add('hidden');
    roomPage.setAttribute('aria-hidden', 'true');
    if (activeRoomMessageUnsubscribe) {
      activeRoomMessageUnsubscribe();
      activeRoomMessageUnsubscribe = null;
    }
    activeRoomId = null;
  });
  manageRoomButton.addEventListener('click', () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    isManagingRoom = !isManagingRoom;
    roomManager.classList.toggle('hidden', !isManagingRoom);
    manageRoomButton.setAttribute('aria-expanded', String(isManagingRoom));
    manageRoomButton.textContent = isManagingRoom ? 'Done managing' : 'Manage room';
  });
  deleteRoomButton.addEventListener('click', () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    deleteRoomStatus.textContent = '';
    deleteRoomStatus.classList.remove('error');
    confirmDeleteRoomButton.disabled = false;
    openModal(deleteRoomConfirmModal);
  });
  document.getElementById('cancelDeleteRoom').addEventListener('click', () => {
    closeModal(deleteRoomConfirmModal);
  });
  deleteRoomConfirmModal.addEventListener('click', (event) => {
    if (event.target === deleteRoomConfirmModal) closeModal(deleteRoomConfirmModal);
  });
  confirmDeleteRoomButton.addEventListener('click', async () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) {
      closeModal(deleteRoomConfirmModal);
      return;
    }
    confirmDeleteRoomButton.disabled = true;
    deleteRoomStatus.textContent = 'Deleting chat room...';
    deleteRoomStatus.classList.remove('error');
    try {
      const messages = await getDocs(collection(db, 'rooms', room.id, 'messages'));
      for (let offset = 0; offset < messages.docs.length; offset += 400) {
        const batch = writeBatch(db);
        messages.docs.slice(offset, offset + 400).forEach((message) => batch.delete(message.ref));
        await batch.commit();
      }
      if (room.banner) {
        await deleteObject(ref(storage, `users/${auth.currentUser.uid}/rooms/${room.id}/banner`));
      }
      await deleteDoc(doc(db, 'rooms', room.id));
      rooms = rooms.filter((item) => item.id !== room.id);
      if (activeRoomMessageUnsubscribe) {
        activeRoomMessageUnsubscribe();
        activeRoomMessageUnsubscribe = null;
      }
      activeRoomId = null;
      isManagingRoom = false;
      roomPage.classList.add('hidden');
      roomPage.setAttribute('aria-hidden', 'true');
      closeModal(deleteRoomConfirmModal);
      renderRooms();
      renderDiscoverFeed();
    } catch (error) {
      deleteRoomStatus.textContent = `Unable to delete chat room: ${error.message}`;
      deleteRoomStatus.classList.add('error');
      confirmDeleteRoomButton.disabled = false;
    }
  });
  roomBannerInput.addEventListener('change', async () => {
    const file = roomBannerInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      roomStatus.textContent = 'Choose an image banner up to 2 MB.';
      roomStatus.classList.add('error');
      roomBannerInput.value = '';
      return;
    }
    try {
      roomBanner.src = await readImageFile(file);
      roomBanner.classList.remove('hidden');
      roomHero.classList.add('has-banner');
      roomStatus.textContent = '';
      roomStatus.classList.remove('error');
    } catch (error) {
      roomStatus.textContent = `Unable to preview banner: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  saveRoomSettingsButton.addEventListener('click', async () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    const title = roomTitleInput.value.trim();
    if (!title) {
      roomStatus.textContent = 'Add a title for this chat room.';
      roomStatus.classList.add('error');
      roomTitleInput.focus();
      return;
    }
    const bannerFile = roomBannerInput.files?.[0];
    try {
      const banner = bannerFile
        ? await uploadDataUrl(
            `users/${auth.currentUser.uid}/rooms/${room.id}/banner`,
            await readImageFile(bannerFile)
          )
        : room.banner || '';
      const updatedRoom = {
        ...room,
        title,
        description: roomDescriptionInput.value.trim(),
        banner,
        updatedAt: serverTimestamp()
      };
      await updateDoc(doc(db, 'rooms', room.id), {
        title: updatedRoom.title,
        description: updatedRoom.description,
        banner: updatedRoom.banner,
        updatedAt: updatedRoom.updatedAt
      });
      rooms = rooms.map((item) => item.id === room.id ? updatedRoom : item);
      roomBannerInput.value = '';
      roomStatus.textContent = 'Room settings saved.';
      roomStatus.classList.remove('error');
      renderRooms();
      openRoomPage(updatedRoom);
      isManagingRoom = true;
      roomManager.classList.remove('hidden');
      manageRoomButton.textContent = 'Done managing';
      manageRoomButton.setAttribute('aria-expanded', 'true');
    } catch (error) {
      roomStatus.textContent = `Unable to save room settings: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  createRoomForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signin')) return;
    const user = auth.currentUser;
    if (!user) {
      createRoomStatus.textContent = 'Sign in to make a chat room.';
      createRoomStatus.classList.add('error');
      return;
    }
    const formData = new FormData(createRoomForm);
    const title = formData.get('title').toString().trim();
    if (!title) {
      createRoomStatus.textContent = 'Add a title for this chat room.';
      createRoomStatus.classList.add('error');
      return;
    }
    const roomRef = doc(collection(db, 'rooms'));
    const room = {
      id: roomRef.id,
      title,
      description: formData.get('description').toString().trim(),
      banner: '',
      ownerUid: user.uid,
      creatorUsername: currentProfile.username || '',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(roomRef, { ...room, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      rooms = [room, ...rooms.filter((item) => item.id !== room.id)];
      renderRooms();
      openRoomPage(room);
    } catch (error) {
      createRoomStatus.textContent = `Unable to create chat room: ${error.message}`;
      createRoomStatus.classList.add('error');
    }
  });
  roomMessageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signin')) return;
    if (!activeRoomId || !auth.currentUser) return;
    const text = roomMessageInput.value.trim();
    if (!text && !selectedRoomGif) return;
    try {
      await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
        senderUid: auth.currentUser.uid,
        senderUsername: currentProfile?.username || 'Aethel member',
        text,
        ...(selectedRoomGif ? {
          gifUrl: selectedRoomGif.url,
          gifTitle: selectedRoomGif.title || 'KLIPY GIF'
        } : {}),
        createdAt: serverTimestamp()
      });
      roomMessageForm.reset();
      selectedRoomGif = '';
      roomSelectedGif.classList.add('hidden');
      roomSelectedGifImage.removeAttribute('src');
      roomChatPicker.classList.add('hidden');
    } catch (error) {
      roomStatus.textContent = `Unable to send message: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  [createPostModal, storeTemplateModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.querySelectorAll('#openPostModalButton, #createPostButton, #feedCreatePost').forEach((button) => {
    button.addEventListener('click', openPostComposer);
  });
  closeStoreTemplate.addEventListener('click', () => closeModal(storeTemplateModal));
  manageStorefrontButton.addEventListener('click', () => {
    const store = stores.find((item) => item.id === activeStorefrontId);
    const isOwner = Boolean(
      store
      && isAuthenticated
      && auth.currentUser
      && store.ownerUid === auth.currentUser.uid
    );
    if (!isOwner) return;
    isManagingStorefront = !isManagingStorefront;
    document.querySelector('.storefront-editor').classList.toggle('hidden', !isManagingStorefront);
    storefrontCreatePost.classList.toggle('hidden', !isManagingStorefront);
    manageStorefrontButton.setAttribute('aria-expanded', String(isManagingStorefront));
    manageStorefrontButton.textContent = isManagingStorefront ? 'Done managing' : 'Manage storefront';
  });
  storefrontBioAction.addEventListener('click', () => {
    const isOpening = storefrontBioEditor.classList.contains('hidden');
    storefrontBioEditor.classList.toggle('hidden', !isOpening);
    storefrontBioAction.setAttribute('aria-expanded', String(isOpening));
    storefrontBioAction.querySelector('.upload-plus').textContent = isOpening ? '−' : '+';
    storefrontBioActionLabel.textContent = isOpening
      ? 'Close Bio Editor'
      : storeTemplateForm.elements.storeBio.value.trim() ? 'Edit Bio' : 'Add Bio';
    if (isOpening) storeTemplateForm.elements.storeBio.focus();
  });
  storeTemplateForm.elements.storeBio.addEventListener('input', (event) => {
    storefrontBio.textContent = event.currentTarget.value.trim() || 'This creator has not added a bio yet.';
  });
  storefrontCreatePost.addEventListener('click', () => {
    const store = stores.find((item) => item.id === activeStorefrontId);
    if (!store || !requireAuth('signup')) return;
    openPostComposer();
    postStorefrontSelect.value = store.id;
  });

  discoverSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    discoverSearchQuery = discoverSearchInput.value.trim().toLowerCase();
    renderDiscoverFeed();
  });
  discoverSearchInput.addEventListener('input', () => {
    discoverSearchQuery = discoverSearchInput.value.trim().toLowerCase();
    renderDiscoverFeed();
  });
  clearDiscoverSearch.addEventListener('click', () => {
    discoverSearchInput.value = '';
    discoverSearchQuery = '';
    renderDiscoverFeed();
    discoverSearchInput.focus();
  });

  document.querySelectorAll('[data-feed-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFeedFilter = button.dataset.feedFilter;
      document.querySelectorAll('[data-feed-filter]').forEach((filterButton) => {
        filterButton.classList.toggle('active', filterButton === button);
      });
      renderDiscoverFeed();
    });
  });

  document.getElementById('closeStoreDetail').addEventListener('click', () => closeModal(storeDetailModal));
  document.getElementById('closeManageStores').addEventListener('click', () => closeModal(manageStoresModal));
  document.getElementById('closeManagePosts').addEventListener('click', () => closeModal(managePostsModal));
  document.getElementById('closeAccount').addEventListener('click', () => closeModal(accountModal));

  [storeDetailModal, storeChatModal, manageStoresModal, managePostsModal, accountModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
};

const bindStoreModal = () => {
  const openerButtons = document.querySelectorAll('#newStoreMiniButton, #feedCreateStore');
  openerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!requireAuth('signup')) return;
      prepareNewStore();
    });
  });

  if (closeStoreModal) {
    closeStoreModal.addEventListener('click', () => closeModal(storeModal));
  }

  if (storeModal) {
    storeModal.addEventListener('click', (event) => {
      if (event.target === storeModal) closeModal(storeModal);
    });
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal(loginModal);
      clearCloudStatus();
    } catch (error) {
      authStatus.textContent = getAuthErrorMessage(error, 'sign in');
      authStatus.classList.remove('hidden');
    }
  });
}

if (signupForm) {
  const signupPasswordInput = document.getElementById('signupPassword');
  const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');

  const validateSignupPasswordMatch = () => {
    if (!signupPasswordInput || !signupConfirmPasswordInput) return true;

    const hasMismatch = signupConfirmPasswordInput.value.length > 0
      && signupPasswordInput.value !== signupConfirmPasswordInput.value;
    signupConfirmPasswordInput.setCustomValidity(hasMismatch ? 'Passwords do not match' : '');
    signupConfirmPasswordInput.classList.toggle('password-mismatch', hasMismatch);
    signupConfirmPasswordInput.setAttribute('aria-invalid', String(hasMismatch));

    if (passwordMatchMessage) {
      passwordMatchMessage.textContent = hasMismatch ? 'Passwords do not match.' : '';
      passwordMatchMessage.classList.toggle('hidden', !hasMismatch);
    }

    return !hasMismatch;
  };

  if (signupPasswordInput && signupConfirmPasswordInput) {
    signupPasswordInput.addEventListener('input', validateSignupPasswordMatch);
    signupConfirmPasswordInput.addEventListener('input', validateSignupPasswordMatch);
  }

  signupForm.addEventListener('submit', async (event) => {
    if (!validateSignupPasswordMatch()) {
      event.preventDefault();
      signupConfirmPasswordInput?.reportValidity();
      return;
    }

    event.preventDefault();
    const formData = new FormData(signupForm);
    const profile = {
      fullName: formData.get('fullName').toString().trim(),
      username: formData.get('username').toString().trim(),
      email: formData.get('email').toString().trim(),
      role: formData.get('accountType') === 'creator' ? formData.get('role').toString() : '',
      focus: formData.get('accountType') === 'creator' ? formData.get('focus').toString() : '',
      accountType: formData.get('accountType').toString(),
      socialLinks: [],
      profilePicture: ''
    };
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        profile.email,
        formData.get('password').toString()
      );
      currentProfile = { ...profile, uid: credential.user.uid };
      await saveProfile();
      setAuthenticated(currentProfile);
      closeModal(loginModal);
      clearCloudStatus();
    } catch (error) {
      authStatus.textContent = getAuthErrorMessage(error, 'create your account');
      authStatus.classList.remove('hidden');
    }
  });
}

if (accountForm) {
  accountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(accountForm);
    const socialInputs = Array.from(accountForm.querySelectorAll('.profile-social-input'));
    const invalidSocialInput = socialInputs.find((input) => input.value.trim() && !getSocialService(input.value));
    const saveStatus = document.getElementById('accountSaveStatus');

    if (invalidSocialInput) {
      invalidSocialInput.setCustomValidity('Enter a valid HTTP or HTTPS profile URL.');
      invalidSocialInput.reportValidity();
      return;
    }

    const photoFile = formData.get('profilePicture');
    if (photoFile?.size > 2 * 1024 * 1024) {
      saveStatus.textContent = 'Profile photos must be 2 MB or smaller.';
      saveStatus.classList.add('error');
      return;
    }

    try {
      const profileImage = photoFile?.size
        ? await readImageFile(photoFile)
        : currentProfile?.profilePicture || '';
      const profilePicture = await uploadDataUrl(
        `users/${auth.currentUser.uid}/profile/avatar`,
        profileImage
      );
      currentProfile = {
        ...currentProfile,
        fullName: formData.get('fullName').toString().trim(),
        username: formData.get('username').toString().trim(),
        email: formData.get('email').toString().trim(),
        role: formData.get('role').toString(),
        focus: formData.get('focus').toString(),
        socialLinks: socialInputs
          .map((input) => input.value.trim())
          .filter(Boolean)
          .map((url) => new URL(url).href),
        profilePicture
      };
      await saveProfile();
      renderProfileArea();
      document.getElementById('profilePictureInput').value = '';
      saveStatus.textContent = 'Profile saved.';
      saveStatus.classList.remove('error');
    } catch (error) {
      saveStatus.textContent = `Unable to save profile: ${error.message}`;
      saveStatus.classList.add('error');
    }
  });
}

if (passwordResetForm) {
  const newPasswordInput = passwordResetForm.elements.newPassword;
  const confirmPasswordInput = passwordResetForm.elements.confirmPassword;
  const validateNewPassword = () => {
    const hasMismatch = confirmPasswordInput.value.length > 0
      && newPasswordInput.value !== confirmPasswordInput.value;
    confirmPasswordInput.setCustomValidity(hasMismatch ? 'New passwords do not match' : '');
    passwordResetStatus.textContent = hasMismatch ? 'New passwords do not match.' : '';
    passwordResetStatus.classList.toggle('error', hasMismatch);
    return !hasMismatch;
  };

  newPasswordInput.addEventListener('input', validateNewPassword);
  confirmPasswordInput.addEventListener('input', validateNewPassword);
  passwordResetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateNewPassword()) {
      confirmPasswordInput.reportValidity();
      return;
    }

    const user = auth.currentUser;
    if (!user?.email) {
      passwordResetStatus.textContent = 'Sign in again before changing your password.';
      passwordResetStatus.classList.add('error');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordResetForm.elements.currentPassword.value
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPasswordInput.value);
      passwordResetForm.reset();
      passwordResetStatus.textContent = 'Password updated.';
      passwordResetStatus.classList.remove('error');
    } catch (error) {
      passwordResetStatus.textContent = `Unable to update password: ${error.message}`;
      passwordResetStatus.classList.add('error');
    }
  });
}

storeList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-store-id]');
  if (!card) return;
  const store = stores.find((item) => item.id === card.dataset.storeId);
  if (!store) return;
  openStoreTemplate(store);
});

storeDetailContent.addEventListener('click', (event) => {
  const messageButton = event.target.closest('[data-message-store-id]');
  if (!messageButton) return;
  const store = stores.find((item) => item.id === messageButton.dataset.messageStoreId);
  if (store) openStoreChat(store);
});

storefrontMessageButton.addEventListener('click', () => {
  const store = stores.find((item) => item.id === storefrontMessageButton.dataset.messageStoreId);
  if (store) openStoreChat(store);
});

storeChatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireAuth('signin')) return;
  const message = storeChatForm.elements.message.value.trim();
  if (!message || !activeChatConversationId) return;

  addDoc(collection(db, 'chats', activeChatConversationId, 'messages'), {
    senderUid: auth.currentUser.uid,
    text: message,
    createdAt: serverTimestamp()
  }).then(() => {
    storeChatForm.reset();
  }).catch(showCloudError);
});

managedPostList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-post]');
  if (!deleteButton) return;
  const post = discoverPosts.find((item) => item.id === deleteButton.dataset.deletePost);
  if (!post || !window.confirm('Delete this post? This cannot be undone.')) return;

  discoverPosts = discoverPosts.filter((item) => item.id !== post.id);
  deleteDoc(doc(db, 'posts', post.id)).catch(showCloudError);
  saveDiscoverPosts();
  renderManagedPosts();
  renderDiscoverFeed();
});

managedStoreList.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-store]');
  if (editButton) {
    const store = stores.find((item) => item.id === editButton.dataset.editStore);
    if (store) prepareStoreEdit(store);
    return;
  }

  const deleteButton = event.target.closest('[data-delete-store]');
  if (!deleteButton) return;
  const store = stores.find((item) => item.id === deleteButton.dataset.deleteStore);
  if (!store || !window.confirm(`Delete "${store.name}"? This cannot be undone.`)) return;
  stores = stores.filter((item) => item.id !== store.id);
  deleteDoc(doc(db, 'stores', store.id)).catch(showCloudError);
  renderStores();
  renderManagedStores();
});

if (storeForm) {
  storeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signup') || currentProfile?.accountType === 'shopper') return;
    const formData = new FormData(storeForm);
    const name = formData.get('storeName').toString().trim();
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const handle = currentProfile?.username || `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    const store = {
      id,
      name,
      handle,
      category: 'Web Design',
      bio: '',
      logo: '',
      banner: '',
      socialLinks: getProfileSocialUrls(currentProfile),
      media: [],
      projectImages: [],
      paymentApp: '',
      paymentHandle: '',
      qrValue: '',
      qrImage: '',
      ownerUid: auth.currentUser.uid,
      draft: true
    };

    stores.unshift(store);
    try {
      await saveStores([store]);
    } catch {
      stores = stores.filter((item) => item.id !== store.id);
      renderStores();
      showCloudError(new Error('Unable to save the new storefront.'));
      return;
    }
    renderStores();
    renderManagedStores();
    storeForm.reset();
    openStoreTemplate(store);
  });
}

storeTemplateMedia.addEventListener('change', () => {
  const files = Array.from(storeTemplateMedia.files || []);
  const hasInvalidFile = files.some((file) => (
    file.size > 2 * 1024 * 1024
    || (!file.type.startsWith('image/') && !['video/mp4', 'video/webm'].includes(file.type))
  ));

  if (files.length > 6 || hasInvalidFile) {
    storeTemplateStatus.textContent = 'Choose up to 6 images or MP4/WebM videos, each 2 MB or smaller.';
    storeTemplateStatus.classList.add('error');
    storeTemplateMedia.value = '';
    renderStoreTemplateMedia([]);
    return;
  }

  storeTemplateStatus.textContent = '';
  storeTemplateStatus.classList.remove('error');
  renderStoreTemplateMedia(files);
});

const previewStoreBrandImage = async (input, target, isLogo) => {
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
    storeTemplateStatus.textContent = 'Choose an image file up to 2 MB.';
    storeTemplateStatus.classList.add('error');
    input.value = '';
    return;
  }
  try {
    const data = await readImageFile(file);
    if (isLogo) {
      const image = createElement('img');
      image.src = data;
      image.alt = `${document.getElementById('storeTemplateTitle').textContent} logo`;
      target.replaceChildren(image);
    } else {
      target.src = data;
      target.classList.remove('hidden');
      storefrontHero.classList.add('has-banner');
    }
    storeTemplateStatus.textContent = '';
    storeTemplateStatus.classList.remove('error');
  } catch {
    storeTemplateStatus.textContent = 'Unable to read that image. Try another file.';
    storeTemplateStatus.classList.add('error');
  }
};

storeLogoInput.addEventListener('change', () => previewStoreBrandImage(storeLogoInput, storefrontLogo, true));
storeBannerInput.addEventListener('change', () => previewStoreBrandImage(storeBannerInput, storefrontBanner, false));

storeTemplateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const store = stores.find((item) => item.id === editingStoreId);
  if (!store) return;
  if (
    !isAuthenticated
    || !auth.currentUser
    || auth.currentUser.uid !== store.ownerUid
  ) {
    storeTemplateStatus.textContent = 'Only the storefront creator can edit this page.';
    storeTemplateStatus.classList.add('error');
    return;
  }

  const socialInputs = Array.from(storeTemplateForm.querySelectorAll('.profile-social-input'));
  const invalidSocialInput = socialInputs.find((input) => input.value.trim() && !getSocialService(input.value));
  if (invalidSocialInput) {
    invalidSocialInput.setCustomValidity('Enter a valid HTTP or HTTPS social URL.');
    invalidSocialInput.reportValidity();
    return;
  }

  const files = Array.from(storeTemplateMedia.files || []);
  const logoFile = storeLogoInput.files?.[0];
  const bannerFile = storeBannerInput.files?.[0];
  if (
    files.length > 6
    || files.some((file) => file.size > 2 * 1024 * 1024)
    || [logoFile, bannerFile].some((file) => file && (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024))
  ) {
    storeTemplateStatus.textContent = 'Choose up to 6 media files and image branding files, all up to 2 MB each.';
    storeTemplateStatus.classList.add('error');
    return;
  }

  try {
    const selectedMedia = files.length
      ? await Promise.all(files.map(async (file) => ({ type: file.type, data: await readImageFile(file) })))
      : store.media?.length
        ? store.media
        : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
    const media = await Promise.all(selectedMedia.map((item, index) => uploadMediaItem(store.id, item, index)));
    const [logo, banner] = await Promise.all([
      logoFile
        ? uploadDataUrl(`users/${auth.currentUser.uid}/stores/${store.id}/branding/logo`, await readImageFile(logoFile))
        : store.logo || '',
      bannerFile
        ? uploadDataUrl(`users/${auth.currentUser.uid}/stores/${store.id}/branding/banner`, await readImageFile(bannerFile))
        : store.banner || ''
    ]);
    const updatedStore = {
      ...store,
      bio: storeTemplateForm.elements.storeBio.value.trim(),
      logo,
      banner,
      socialLinks: socialInputs.map((input) => input.value.trim()).filter(Boolean).map((url) => new URL(url).href),
      media,
      projectImages: media.filter((item) => item.type.startsWith('image/')).map((item) => item.data),
      draft: false
    };

    stores = stores.map((item) => item.id === updatedStore.id ? updatedStore : item);
    await saveStores([updatedStore]);
    renderStores();
    renderManagedStores();
    renderPostStoreOptions();
    renderStorefrontPage(updatedStore);
  } catch (error) {
    storeTemplateStatus.textContent = `Unable to save storefront: ${error.message}`;
    storeTemplateStatus.classList.add('error');
  }
});

bindLoginModal();
bindStoreModal();
renderStores();
renderDiscoverFeed();
setLoggedOut();

onSnapshot(collection(db, 'stores'), (snapshot) => {
  stores = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  renderStores();
  renderManagedStores();
  if (activeStorefrontId && !storeTemplateModal.classList.contains('hidden')) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
}, showCloudError);

onSnapshot(collection(db, 'posts'), (snapshot) => {
  discoverPosts = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => {
      const first = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const second = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return second - first;
    });
  renderDiscoverFeed();
  renderManagedPosts();
  if (activeStorefrontId && !storeTemplateModal.classList.contains('hidden')) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
}, showCloudError);

onSnapshot(collection(db, 'rooms'), (snapshot) => {
  rooms = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => {
      const first = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const second = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return second - first;
    });
  renderRooms();
  if (activeRoomId && !roomPage.classList.contains('hidden')) {
    const activeRoom = rooms.find((item) => item.id === activeRoomId);
    if (activeRoom) {
      const wasManaging = isManagingRoom;
      const isOwner = activeRoom.ownerUid === auth.currentUser?.uid;
      roomHero.classList.toggle('has-banner', Boolean(activeRoom.banner));
      roomBanner.classList.toggle('hidden', !activeRoom.banner);
      if (activeRoom.banner) roomBanner.src = activeRoom.banner;
      roomPageTitle.textContent = activeRoom.title || 'Untitled room';
      roomPageDescription.textContent = activeRoom.description || 'Join the conversation.';
      roomCreatorName.textContent = `Created by ${activeRoom.creatorUsername || 'Aethel creator'}`;
      manageRoomButton.classList.toggle('hidden', !isOwner);
      if (wasManaging && isOwner) {
        roomTitleInput.value = activeRoom.title || '';
        roomDescriptionInput.value = activeRoom.description || '';
        isManagingRoom = true;
        roomManager.classList.remove('hidden');
        manageRoomButton.textContent = 'Done managing';
        manageRoomButton.setAttribute('aria-expanded', 'true');
      } else {
        isManagingRoom = false;
        roomManager.classList.add('hidden');
        manageRoomButton.textContent = 'Manage room';
        manageRoomButton.setAttribute('aria-expanded', 'false');
      }
    }
  }
}, showCloudError);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    setLoggedOut();
    if (signingOutForInactivity) {
      signingOutForInactivity = false;
      authStatus.textContent = 'You were signed out after 30 minutes of inactivity. Please sign in again.';
      authStatus.classList.remove('hidden');
      openModal(loginModal);
      setAuthMode('signin');
      return;
    }
    if (!readStoredValue('aethelWelcomeSeen', false)) openModal(firstVisitWelcome);
    return;
  }
  if (!startInactivityMonitor(user)) return;
  try {
    const profileSnapshot = await getDoc(doc(db, 'profiles', user.uid));
    currentProfile = profileSnapshot.exists()
      ? { ...profileSnapshot.data(), uid: user.uid, email: user.email }
      : {
          uid: user.uid,
          email: user.email || '',
          fullName: '',
          username: '',
          role: 'Web designer',
          focus: 'Landing pages',
          accountType: 'creator',
          socialLinks: [],
          profilePicture: ''
        };
    if (!profileSnapshot.exists()) await saveProfile();
    setAuthenticated(currentProfile);
    migrateLegacyPublicNames(user.uid, currentProfile.username).catch(showCloudError);
    closeModal(firstVisitWelcome);
    if (activeStorefrontId) {
      const activeStore = stores.find((item) => item.id === activeStorefrontId);
      if (activeStore) renderStorefrontPage(activeStore);
    }
    if (activeRoomId) {
      const activeRoom = rooms.find((item) => item.id === activeRoomId);
      if (activeRoom) openRoomPage(activeRoom);
    }
  } catch (error) {
    showCloudError(error);
    setAuthenticated({
      uid: user.uid,
      email: user.email || '',
      fullName: '',
      username: '',
      accountType: 'creator',
      socialLinks: []
    });
  }
}, showCloudError);

const storyPills = document.querySelectorAll('.story');
storyPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    storyPills.forEach((item) => item.classList.remove('active'));
    pill.classList.add('active');
  });
});
