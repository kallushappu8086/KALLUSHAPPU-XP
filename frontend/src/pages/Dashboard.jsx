import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { io } from 'socket.io-client';
import CropModal from '../components/CropModal';
import AdminServerSettings from '../components/AdminServerSettings';
import {
  Shield,
  UserCheck,
  Sparkles,
  MessageSquare,
  Info,
  ChevronLeft,
  Save,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  Send,
  Megaphone,
  Ticket,
  Trash2,
  Server,
  Edit3,
  Plus,
  Video,
  BarChart2,
  ShieldAlert,
  Home,
  LogOut,
  RotateCw,
  Mic,
  UploadCloud,
  X,
  Check,
  Hash,
  Search,
  Settings,
  Image as ImageIcon,
  Link as LinkIcon,
  Gift,
  Trophy,
  Clock,
  Users,
  Award,
  CheckSquare,
  Square,
  Lock,
  UserX,
  MicOff,
  PhoneOff,
  Download,
  Camera,
  Copy,
  Code,
  Layers,
  ShieldCheck
} from 'lucide-react';

const Youtube = ({ size = 24, className = '', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.969.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.389-.507a3.007 3.007 0 0 0 2.11-2.11C24 15.969 24 12 24 12s0-3.969-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);


const EMOJI_CATEGORIES = [
  { id: 'smileys', icon: '😀', label: 'Smileys & Emotion', list: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😮‍💨', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🔥', '✨', '💥', '💯', '❤️', '💖', '🙏', '👍', '👎', '👏', '🙌', '👑'] },
  { id: 'people', icon: '👋', label: 'People & Body', list: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '👑', '🧢', '👒', '🎓', '🎩'] },
  { id: 'animals', icon: '🐶', label: 'Animals & Nature', list: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆'] },
  { id: 'food', icon: '🍕', label: 'Food & Drink', list: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥗', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🥟', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤'] },
  { id: 'activities', icon: '⚽', label: 'Activities & Sports', list: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🎿', '🏂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🧘', '🏄', '🏊', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎫', '🎟️', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎙️', '🎸', '🎹', '🎺', '🎻', '🥁', '🎲', '♟️', '🎯', ' bowling', '🎮', '🎰', '🧩'] },
  { id: 'travel', icon: '🚗', label: 'Travel & Places', list: ['🚗', '🚕', '🚙', '🚌', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🚲', '🛴', '🚨', '🚘', '✈️', '🛫', '🛬', '🛸', '🚀', '🛰️', '🚁', '🛶', '⛵', '🚤', '🛳️', '⚓', '⛽', '🚧', '🚦', '🗺️', '🗿', '🗽', '<ctrl42>', '🏰', '🏯', '🏟️', '🎡', '🎢', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '🏠', '🏡', '🏙️', '🌅', '🌄', '🌇', '🌆', '🌃', '🌌'] },
  { id: 'objects', icon: '💡', label: 'Objects & Tools', list: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🕹️', '💽', '💾', '💿', '📀', '📷', '📸', '📹', '🎥', '📽️', '📻', '🎙️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '⚙️', '💣', '🔪', '🗡️', '⚔️', '🛡️', '🔮', '📿', '🔑', '🗝️', '🔒', '🔓'] },
  { id: 'symbols', icon: '🔣', label: 'Symbols & Icons', list: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '<ctrl42>', '☯️', '☦️', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⚛️', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🆚', '🅰️', '🅱️', '🆎', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '🚫', '💯', '💢', '♨️', '❗', '❕', '❓', '❔', '‼️', '⁉️', '⚠️', '🔱', '⚜️', '🔰', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🚻', '🧹', '💬', '💭', '🛑', '✅', '☑️', '✔️', '✖️', '❌', '➕', '➖', '➗', '♾️'] },
  { id: 'flags', icon: '🚩', label: 'Flags', list: ['🚩', '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇮🇳', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇰🇷', '🇨🇳', '🇧🇷', '🇲🇽', '🇮🇹', '🇪🇸', '🇷🇺'] }
];

function EmojiPickerModal({ isOpen, onClose, onSelectEmoji, guildEmojis = [] }) {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentCategoryObj = EMOJI_CATEGORIES.find(c => c.id === activeCategory);

  const filteredUnicode = searchQuery.trim()
    ? EMOJI_CATEGORIES.flatMap(c => c.list).filter((e, idx, self) => self.indexOf(e) === idx)
    : (currentCategoryObj ? currentCategoryObj.list : []);

  const filteredGuildEmojis = searchQuery.trim()
    ? guildEmojis.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : (activeCategory === 'server' ? guildEmojis : []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#2b2d31',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
          padding: '16px',
          color: '#f2f3f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '85vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>😊</span>
            <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>Emoji Picker</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#949ba4', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#949ba4' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all emojis..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              backgroundColor: '#1e1f22',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Tabs */}
        {!searchQuery.trim() && (
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {EMOJI_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                title={cat.label}
                style={{
                  background: activeCategory === cat.id ? 'rgba(88, 101, 242, 0.3)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: '1',
                  transition: 'background 0.15s'
                }}
              >
                {cat.icon}
              </button>
            ))}
            {guildEmojis.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveCategory('server')}
                title="Server Emojis"
                style={{
                  background: activeCategory === 'server' ? 'rgba(88, 101, 242, 0.3)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#5865F2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                🌐 Server ({guildEmojis.length})
              </button>
            )}
          </div>
        )}

        {/* Emoji Display Grid */}
        <div style={{ overflowY: 'auto', minHeight: '220px', maxHeight: '340px', paddingRight: '4px' }}>
          {/* Guild Emojis Section */}
          {(activeCategory === 'server' || searchQuery.trim()) && filteredGuildEmojis.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#949ba4', marginBottom: '8px', textTransform: 'uppercase' }}>
                Server Emojis ({filteredGuildEmojis.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '6px' }}>
                {filteredGuildEmojis.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    title={`:${g.name}: (${g.identifier})`}
                    onClick={() => {
                      onSelectEmoji(g.identifier);
                      onClose();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.1s, background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={g.url} alt={g.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Unicode Emojis Section */}
          {activeCategory !== 'server' && (
            <div>
              {!searchQuery.trim() && (
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#949ba4', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {currentCategoryObj?.label}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '4px' }}>
                {filteredUnicode.map((emojiChar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectEmoji(emojiChar);
                      onClose();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px',
                      fontSize: '1.3rem',
                      lineHeight: '1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.1s, background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {emojiChar}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Discord Message Preview Component
function DiscordMessagePreview({
  botUser,
  guildName,
  guildIcon,
  message,
  buttonEnabled,
  buttonLabel,
  embedEnabled,
  embedTitle,
  embedDesc,
  embedColor,
  embedThumb,
  embedImage,
  isDM = false,
  // New props for expanded announcement features:
  pingType = 'none',
  pingRoleId = '',
  roles = [],
  embedAuthorEnabled = false,
  embedAuthorName = '',
  embedAuthorIcon = '',
  embedAuthorUrl = '',
  embedFooterEnabled = false,
  embedFooterText = '',
  embedFooterIcon = '',
  embedFields = [],
  buttons = [],
  selectMenuEnabled = false,
  selectMenuPlaceholder = 'Select a ticket category...',
  selectMenuOptions = [],
  layout = 'buttons',
  sectionOptions = []
}) {
  // Resolve placeholders
  const resolvePlaceholders = (text) => {
    if (!text) return '';
    return text
      .replace(/{username}/g, botUser?.username || 'Member')
      .replace(/{server}/g, guildName || 'Server');
  };

  // Prepend source header if it's a DM
  let contentText = resolvePlaceholders(message);
  if (isDM) {
    if (contentText) {
      contentText = `Sent from: **${guildName}**\n\n` + contentText;
    } else {
      contentText = `Sent from: **${guildName}**`;
    }
  }

  // Parse markdown bold **text** and Discord custom emojis <a?:name:id> for visual correctness
  const formatMarkdown = (text) => {
    if (!text) return null;
    const parts = text.split(/(<a?:[a-zA-Z0-9_]+:\d+>|\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: '#ffffff' }}>{part.slice(2, -2)}</strong>;
      }
      const emojiMatch = part.match(/<(a)?:([a-zA-Z0-9_]+):(\d+)>/);
      if (emojiMatch) {
        const isAnimated = !!emojiMatch[1];
        const emojiName = emojiMatch[2];
        const emojiId = emojiMatch[3];
        const ext = isAnimated ? 'gif' : 'png';
        const url = `https://cdn.discordapp.com/emojis/${emojiId}.${ext}`;
        return (
          <img
            key={index}
            src={url}
            alt={emojiName}
            title={`:${emojiName}:`}
            style={{ width: '1.3em', height: '1.3em', verticalAlign: '-0.25em', display: 'inline-block', margin: '0 2px' }}
          />
        );
      }
      return part;
    });
  };

  const botAvatar = botUser?.avatar
    ? `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  // Construct Ping mention preview node
  let pingPrefixNode = null;
  if (!isDM && pingType && pingType !== 'none') {
    let pingText = '';
    let pingColor = '#c9cdfb';
    if (pingType === 'everyone') {
      pingText = '@everyone';
    } else if (pingType === 'here') {
      pingText = '@here';
    } else if (pingType === 'role' && pingRoleId) {
      const targetRole = roles?.find(r => r.id === pingRoleId);
      pingText = targetRole ? `@${targetRole.name}` : '@deleted-role';
      if (targetRole && targetRole.color && targetRole.color !== '#000000') {
        pingColor = targetRole.color;
      }
    }

    if (pingText) {
      pingPrefixNode = (
        <span style={{
          backgroundColor: 'rgba(88, 101, 242, 0.3)',
          color: pingColor,
          padding: '0 4px',
          borderRadius: '3px',
          fontWeight: '500',
          marginRight: '6px',
          fontSize: '0.9rem',
          userSelect: 'none'
        }}>
          {pingText}
        </span>
      );
    }
  }

  return (
    <div style={{
      backgroundColor: '#313338',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      color: '#dbdee1',
      fontSize: '0.95rem',
      lineHeight: '1.375rem',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      userSelect: 'none',
      width: '100%',
      maxWidth: '520px',
      height: 'fit-content',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <img
          src={botAvatar}
          alt="Avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}
        />

        {/* Message body container */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600', color: '#f2f3f5', fontSize: '1rem' }}>
              KALLU SHAPPU MODE
            </span>
            <span style={{
              backgroundColor: '#5865F2',
              color: '#ffffff',
              fontSize: '0.625rem',
              fontWeight: '700',
              padding: '1px 4px',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: '0.8rem',
              height: '14px'
            }}>
              BOT
            </span>
            <span style={{ fontSize: '0.75rem', color: '#949ba4', marginLeft: '4px' }}>
              Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Message Content Text (including Ping badge) */}
          {(pingPrefixNode || contentText) && (
            <div style={{ color: '#dbdee1', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '4px', fontSize: '0.9375rem' }}>
              {pingPrefixNode}
              {formatMarkdown(contentText)}
            </div>
          )}

          {/* COMPONENT V2 CONTAINER (type: 17) */}
          {embedEnabled && (embedTitle || embedDesc || (embedFields && embedFields.length > 0) || (buttons && buttons.length > 0) || (buttonEnabled && buttonLabel) || selectMenuEnabled) && (
            <div style={{
              marginTop: '10px',
              maxWidth: '520px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#2b2d31',
              borderLeft: `4px solid ${embedColor || '#2563eb'}`,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
            }}>
              {/* Component V2 Container Header */}
              <div style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                fontSize: '0.675rem',
                color: '#949ba4',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: embedColor || '#2563eb' }}></span>
                  CONTAINER (type: 17)
                </span>
                <span style={{ opacity: 0.6 }}>FLAGS: 32768</span>
              </div>

              {/* Container Body */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', minWidth: 0 }}>
                  {/* Main Text Content (type: 10 TEXT_DISPLAY) */}
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    {/* Embed Author */}
                    {((embedAuthorEnabled && embedAuthorName) || (!embedAuthorEnabled && guildName)) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        {(embedAuthorEnabled ? embedAuthorIcon : guildIcon) ? (
                          <img
                            src={embedAuthorEnabled ? embedAuthorIcon : guildIcon}
                            alt=""
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : null}
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                          {embedAuthorEnabled ? formatMarkdown(resolvePlaceholders(embedAuthorName)) : guildName}
                        </span>
                      </div>
                    )}

                    {/* Embed Title */}
                    {embedTitle && (
                      <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '1.05rem', marginBottom: '8px', wordBreak: 'break-word' }}>
                        {formatMarkdown(resolvePlaceholders(embedTitle))}
                      </div>
                    )}

                    {/* Embed Description */}
                    {embedDesc && (
                      <div style={{ fontSize: '0.875rem', color: '#dbdee1', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {formatMarkdown(resolvePlaceholders(embedDesc))}
                      </div>
                    )}

                    {/* Embed Fields */}
                    {embedFields && embedFields.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: '12px' }}>
                        {embedFields.map((field, idx) => {
                          if (!field.name || !field.value) return null;
                          const width = field.inline ? 'calc(33.3% - 11px)' : '100%';
                          return (
                            <div key={idx} style={{ flex: `1 0 ${field.inline ? '120px' : '100%'}`, maxWidth: width, wordBreak: 'break-word' }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>
                                {formatMarkdown(resolvePlaceholders(field.name))}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#dbdee1', whiteSpace: 'pre-wrap' }}>
                                {formatMarkdown(resolvePlaceholders(field.value))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Large Image (type: 12 MEDIA_GALLERY) */}
                    {embedImage && (
                      <div style={{ marginTop: '12px', borderRadius: '4px', overflow: 'hidden', maxWidth: '100%', maxHeight: '300px' }}>
                        <img src={embedImage} alt="" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '4px' }} />
                      </div>
                    )}

                    {/* Embed Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: '#949ba4', fontSize: '0.75rem' }}>
                      {(embedFooterEnabled ? embedFooterIcon : guildIcon) ? (
                        <img src={embedFooterEnabled ? embedFooterIcon : guildIcon} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : null}
                      <span>{embedFooterEnabled ? formatMarkdown(resolvePlaceholders(embedFooterText)) : `${guildName} Official System`}</span>
                      <span>•</span>
                      <span>Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {embedThumb && (
                    <div style={{ flexShrink: 0, width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={embedThumb} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                {/* SECTION ACCESSORY BUTTONS LAYOUT (Screenshot 1 Style) */}
                {layout === 'sections' && sectionOptions && sectionOptions.length > 0 && (
                  <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column' }}>
                    {sectionOptions.map((opt, idx) => (
                      <div key={idx}>
                        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 200px', minWidth: 0, fontSize: '0.875rem', lineHeight: '1.3' }}>
                            <span style={{ color: '#ffffff', fontWeight: '600' }}>
                              {opt.emoji ? `${opt.emoji} ` : ''}{opt.label || `Option #${idx + 1}`}
                            </span>
                            {opt.description ? (
                              <span style={{ color: '#949ba4' }}> — {opt.description}</span>
                            ) : null}
                          </div>
                          <div style={{ flexShrink: 0 }}>
                            <span
                              style={{
                                backgroundColor: opt.style === 'danger' ? '#da373c' : opt.style === 'success' ? '#248046' : opt.style === 'secondary' ? '#4e5058' : '#5865F2',
                                color: '#ffffff',
                                padding: '6px 14px',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'default',
                                userSelect: 'none',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {opt.emoji && <span>{opt.emoji}</span>}
                              <span>{opt.label || 'Ticket'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTION ROW (type: 1) WITH BUTTONS (type: 2) INSIDE THE CONTAINER (Screenshot 2 Style) */}
                {layout !== 'sections' && ((buttons && buttons.length > 0) || (buttonEnabled && buttonLabel)) && (
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {buttons && buttons.length > 0 ? (
                      buttons.map((btn, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: btn.style === 'danger' ? '#da373c' : btn.style === 'success' ? '#248046' : btn.style === 'secondary' ? '#4e5058' : '#5865F2',
                            color: '#ffffff',
                            padding: '7px 16px',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{formatMarkdown(btn.label)}</span>
                        </span>
                      ))
                    ) : (
                      <span
                        style={{
                          backgroundColor: '#5865F2',
                          color: '#ffffff',
                          padding: '7px 16px',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{buttonLabel}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* SELECT MENU COMPONENT INSIDE THE CONTAINER */}
                {selectMenuEnabled && (
                  <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%' }}>
                    <div style={{
                      backgroundColor: '#1e1f22',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      color: '#dbdee1',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      <span style={{ fontWeight: '500' }}>{selectMenuPlaceholder || 'Select an option...'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {/* Options list inside container */}
                    {selectMenuOptions && selectMenuOptions.length > 0 && (
                      <div style={{
                        marginTop: '6px',
                        backgroundColor: '#1e1f22',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        {selectMenuOptions.map((opt, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '8px 12px',
                              borderBottom: idx < selectMenuOptions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              backgroundColor: idx === 0 ? 'rgba(88, 101, 242, 0.15)' : 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                              {opt.emoji && <span>{opt.emoji}</span>}
                              <span>{opt.label || `Option #${idx + 1}`}</span>
                            </div>
                            {opt.description && (
                              <span style={{ fontSize: '0.75rem', color: '#949ba4', paddingLeft: opt.emoji ? '24px' : '0' }}>
                                {opt.description}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ guildId, guildName, guildIcon, memberCount, guildOwnerId, onBack, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [settings, setSettings] = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);
  const [adminHasUnsavedChanges, setAdminHasUnsavedChanges] = useState(false);
  const [currentMemberInfo, setCurrentMemberInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Antinuke Whitelist state
  const [allMembers, setAllMembers] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchedMembers, setSearchedMembers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedWhitelistEvents, setSelectedWhitelistEvents] = useState([]);
  const [failedIds, setFailedIds] = useState(new Set());
  const [modWhitelistSearchQuery, setModWhitelistSearchQuery] = useState('');
  const [modWhitelistSearchedMembers, setModWhitelistSearchedMembers] = useState([]);
  const [modWhitelistSearchLoading, setModWhitelistSearchLoading] = useState(false);
  const [modWhitelistActiveSubtab, setModWhitelistActiveSubtab] = useState('users'); // 'users' | 'roles' | 'channels'
  const [modRoleSearchQuery, setModRoleSearchQuery] = useState('');
  const [modChannelSearchQuery, setModChannelSearchQuery] = useState('');

  // Full Moderation Whitelist state
  const [fullModSearchQuery, setFullModSearchQuery] = useState('');
  const [fullModSearchedMembers, setFullModSearchedMembers] = useState([]);
  const [fullModSearchLoading, setFullModSearchLoading] = useState(false);

  // Per-Option Whitelist Modal state
  const [actionWhitelistModal, setActionWhitelistModal] = useState(null); // { actionKey, title, desc }
  const [actionWhitelistSearchQuery, setActionWhitelistSearchQuery] = useState('');
  const [actionWhitelistSearchedMembers, setActionWhitelistSearchedMembers] = useState([]);
  const [actionWhitelistSearchLoading, setActionWhitelistSearchLoading] = useState(false);

  // Temp Voice Whitelist state
  const [tempVoiceSearchQuery, setTempVoiceSearchQuery] = useState('');
  const [tempVoiceSearchedMembers, setTempVoiceSearchedMembers] = useState([]);
  const [tempVoiceSearchLoading, setTempVoiceSearchLoading] = useState(false);

  const [logs, setLogs] = useState([]);
  const [logFilterCategory, setLogFilterCategory] = useState('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [showLogSettingsPanel, setShowLogSettingsPanel] = useState(true);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);
  const [clearingLogs, setClearingLogs] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadingWelcomeBanner, setUploadingWelcomeBanner] = useState(false);
  const [testingWelcomeMessage, setTestingWelcomeMessage] = useState(false);
  const welcomeBannerFileRef = useRef(null);
  const [welcomePreviewMode, setWelcomePreviewMode] = useState('auto');
  const [showV2JsonModal, setShowV2JsonModal] = useState(false);
  const [copiedV2Json, setCopiedV2Json] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState(null);
  const galleryFileInputRef = useRef(null);

  const [uploadingTicketImage, setUploadingTicketImage] = useState(false);
  const ticketImageFileRef = useRef(null);
  const [uploadingTicketThumb, setUploadingTicketThumb] = useState(false);
  const ticketThumbFileRef = useRef(null);
  const [activeTicketPanelId, setActiveTicketPanelId] = useState(null);
  const [publishingTickets, setPublishingTickets] = useState(false);
  const [ticketPreviewClaimState, setTicketPreviewClaimState] = useState(false);

  // Determine if the current administrator has permission to view/open Server Settings under Full Moderation
  const canAccessServerSettings = (() => {
    if (!user) return false;

    const userId = user.discordId || user.id;

    // Master system admin (KeyAuth / Admin portal) has full access
    if (user.isAdmin && (!userId || userId === 'admin')) {
      return true;
    }

    // Check if current user is the Guild Owner (Owner is always permanently immune)
    const effectiveOwnerId = settings?.guildOwnerId || guildOwnerId;
    const isOwner = (
      (effectiveOwnerId && userId && effectiveOwnerId === userId) ||
      user?.isOwner ||
      currentMemberInfo?.isOwner ||
      allMembers.some(m => m.id === userId && m.isOwner)
    );
    if (isOwner) {
      return true;
    }

    // If Full Moderation is disabled or preventServerSettings is turned off, all administrators can access
    if (!settings?.fullModeration?.enabled || settings.fullModeration.preventServerSettings === false) {
      return true;
    }

    // Under Full Moderation with preventServerSettings active:
    // Administrators must be explicitly whitelisted to see or access Server Settings!
    if (!userId) return false;

    // 1. Check Global Whitelist Users
    const globalUsers = settings.fullModeration.whitelistedUsers || [];
    if (globalUsers.some(u => (typeof u === 'string' ? u === userId : u.userId === userId))) {
      return true;
    }

    // 2. Check Action-Specific Whitelist Users for 'server_settings'
    const actionData = settings.fullModeration.actionWhitelists?.server_settings;
    const actionUsers = actionData?.users || [];
    if (actionUsers.some(u => (typeof u === 'string' ? u === userId : u.userId === userId))) {
      return true;
    }

    // 3. Check Role Whitelists (global or action-specific)
    const currentMember = currentMemberInfo || allMembers.find(m => m.id === userId);
    if (currentMember && Array.isArray(currentMember.roles)) {
      const memberRoleIds = currentMember.roles.map(r => (typeof r === 'string' ? r : r?.id)).filter(Boolean);
      const globalRoles = settings.fullModeration.whitelistedRoles || [];
      if (globalRoles.some(rId => memberRoleIds.includes(typeof rId === 'string' ? rId : rId?.id || rId?.roleId))) {
        return true;
      }
      const actionRoles = actionData?.roles || [];
      if (actionRoles.some(rId => memberRoleIds.includes(typeof rId === 'string' ? rId : rId?.id || rId?.roleId))) {
        return true;
      }
    }

    return false;
  })();

  const handleTicketImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setUploadingTicketImage(true);
    setErrorMsg(null);
    try {
      const res = await api.uploadTicketImage(guildId, file);
      handleInputChange('tickets.imageUrl', res.url);
      setSuccessMsg('Ticket panel embed image uploaded successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload ticket panel image.');
    } finally {
      setUploadingTicketImage(false);
    }
  };

  const [uploadingSelfRolesImage, setUploadingSelfRolesImage] = useState(false);
  const selfRolesImageFileRef = useRef(null);

  const handleSelfRolesImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setUploadingSelfRolesImage(true);
    setErrorMsg(null);
    try {
      const res = await api.uploadSelfRolesImage(guildId, file);
      handleInputChange('selfRoles.imageUrl', res.url);
      setSuccessMsg('Self roles panel embed image uploaded successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload self roles panel image.');
    } finally {
      setUploadingSelfRolesImage(false);
    }
  };

  const handleWelcomeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setUploadingWelcomeBanner(true);
    setErrorMsg(null);
    try {
      const res = await api.uploadBackground(guildId, file);
      handleInputChange('welcome.background', res.url);
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      if (isGif) {
        handleInputChange('welcome.gifSupport', true);
      }
      setSuccessMsg(isGif ? 'Animated GIF banner uploaded!' : 'Banner image uploaded successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload welcome banner.');
    } finally {
      setUploadingWelcomeBanner(false);
    }
  };

  const handleSendTestWelcome = async () => {
    if (!settings?.welcome?.channelId) {
      setErrorMsg('Please select a welcome channel and save settings first before sending a test message.');
      return;
    }
    setTestingWelcomeMessage(true);
    setErrorMsg(null);
    try {
      const res = await api.testWelcome(guildId);
      setSuccessMsg(res.message || 'Test welcome message sent to channel!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send test welcome message. Check bot permissions in the welcome channel.');
    } finally {
      setTestingWelcomeMessage(false);
    }
  };

  const defaultWebcamItems = [
    {
      url: 'https://livevideofeedconvertedtoimage/webcam1.webp',
      description: 'An aerial view looking down on older industrial complex buildings. The main building is white with many windows and pipes running up the walls.'
    },
    {
      url: 'https://livevideofeedconvertedtoimage/webcam2.webp',
      description: "An aerial view of old broken buildings. Nature has begun to take root in the rooftops. A portion of the middle building's roof has collapsed inward. In the distant haze you can make out a far away city."
    },
    {
      url: 'https://livevideofeedconvertedtoimage/webcam3.webp',
      description: 'A street view of a downtown city. Prominently in photo are skyscrapers and a domed building'
    }
  ];

  const handleAddMediaGalleryItem = () => {
    const current = (settings?.welcome?.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0)
      ? settings.welcome.mediaGalleryItems
      : defaultWebcamItems;
    if (current.length >= 10) {
      showNotification('Discord Media Gallery supports up to 10 images.');
      return;
    }
    const updated = [
      ...current,
      {
        url: '',
        description: ''
      }
    ];
    handleInputChange('welcome.mediaGalleryItems', updated);
  };

  const handleUpdateMediaGalleryItem = (index, field, value) => {
    const current = [
      ...((settings?.welcome?.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0)
        ? settings.welcome.mediaGalleryItems
        : defaultWebcamItems)
    ];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };
    handleInputChange('welcome.mediaGalleryItems', current);
  };

  const handleRemoveMediaGalleryItem = (index) => {
    const current = [
      ...((settings?.welcome?.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0)
        ? settings.welcome.mediaGalleryItems
        : defaultWebcamItems)
    ];
    current.splice(index, 1);
    handleInputChange('welcome.mediaGalleryItems', current);
  };

  const handleLoadWebcamPreset = () => {
    handleInputChange('welcome.mediaGalleryItems', defaultWebcamItems);
    handleInputChange('welcome.textDisplayContent', 'Live webcam shots as of 18-04-2025 at 12:00 UTC');
    showNotification('Live webcam preset loaded into Media Gallery!');
  };

  const handleGalleryImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGalleryIdx(index);
    try {
      const res = await api.uploadFile(guildId, file);
      handleUpdateMediaGalleryItem(index, 'url', res.url);
      showNotification(`Gallery image #${index + 1} uploaded!`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload gallery image.');
    } finally {
      setUploadingGalleryIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const getWelcomeV2JsonPayload = () => {
    const formatWelcomeRawString = (rawText) => {
      if (!rawText || typeof rawText !== 'string') return '';
      const count = memberCount || 11;
      const s = ['th', 'st', 'nd', 'rd'];
      const v = count % 100;
      const ordinal = count + (s[(v - 20) % 10] || s[v] || s[0]);
      const ch1 = channels.find(c => c.id === settings?.welcome?.redirectChannelId);
      const ch2 = channels.find(c => c.id === settings?.welcome?.redirectChannelId2);
      const ch3 = channels.find(c => c.id === settings?.welcome?.redirectChannelId3);

      return rawText
        .replace(/{user}/gi, `@${user?.username || 'Member'}`)
        .replace(/{username}/gi, user?.username || 'Member')
        .replace(/{server}/gi, guildName || 'Server')
        .replace(/{member_ordinal}/gi, ordinal)
        .replace(/{memberordinal}/gi, ordinal)
        .replace(/{ordinal}/gi, ordinal)
        .replace(/{member_count}/gi, String(count))
        .replace(/{membercount}/gi, String(count))
        .replace(/{count}/gi, String(count))
        .replace(/{member_number}/gi, `#${count}`)
        .replace(/{membernumber}/gi, `#${count}`)
        .replace(/{channel}/gi, ch1 ? `#${ch1.name}` : '#channel')
        .replace(/{channel2}/gi, ch2 ? `#${ch2.name}` : '#channel2')
        .replace(/{channel3}/gi, ch3 ? `#${ch3.name}` : '#channel3');
    };

    const rawItems = (settings?.welcome?.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0)
      ? settings.welcome.mediaGalleryItems
      : defaultWebcamItems;

    const mediaItems = rawItems
      .filter(item => item && (item.url || item.media?.url))
      .map(item => {
        const url = (item.url || item.media?.url || '').trim();
        const obj = { media: { url } };
        if (item.description && item.description.trim()) {
          obj.description = item.description.trim();
        }
        return obj;
      });

    const innerComponents = [];
    const headerTexts = [];

    // Title (embedTitle)
    const title = settings?.welcome?.embedTitle?.trim();
    if (title) {
      headerTexts.push({
        type: 10,
        content: `# ${formatWelcomeRawString(title)}`
      });
    }

    // Main Text Display (textDisplayContent or message)
    const rawContent = (settings?.welcome?.textDisplayContent && settings.welcome.textDisplayContent.trim())
      ? settings.welcome.textDisplayContent
      : (settings?.welcome?.message || 'Welcome {user} to {server}!');
    if (rawContent) {
      headerTexts.push({
        type: 10,
        content: formatWelcomeRawString(rawContent)
      });
    }

    // Thumbnail / Member Avatar (embedThumbnail)
    const showThumbnail = settings?.welcome?.embedThumbnail !== 'none' && settings?.welcome?.embedThumbnail !== false;
    let thumbUrl = '';
    if (settings?.welcome?.embedThumbnail === '{server_icon}') {
      thumbUrl = guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png';
    } else if (showThumbnail) {
      thumbUrl = user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : (guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png');
    }

    if (showThumbnail && thumbUrl) {
      innerComponents.push({
        type: 9, // ComponentType.SECTION
        components: headerTexts.length > 0 ? headerTexts : [{ type: 10, content: '\u200B' }],
        accessory: {
          type: 11, // ComponentType.THUMBNAIL
          media: { url: thumbUrl }
        }
      });
    } else {
      headerTexts.forEach(txt => innerComponents.push(txt));
    }

    // Member Count / Joining Position & Timestamp
    const metaLines = [];
    if (settings?.welcome?.showMemberCount !== false) {
      const countFormat = settings?.welcome?.memberCountFormat || 'You are the {member_ordinal} member to the server!';
      metaLines.push(`🎉 **${formatWelcomeRawString(countFormat)}**`);
    }
    if (settings?.welcome?.embedTimestamp !== false) {
      metaLines.push(`-# 🕒 Joined Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
    if (metaLines.length > 0) {
      innerComponents.push({
        type: 10,
        content: metaLines.join('\n')
      });
    }

    // Media Gallery (Type 12)
    if (mediaItems.length > 0) {
      innerComponents.push({
        type: 12,
        items: mediaItems
      });
    }

    // Action Rows / Buttons inside container
    const buttons = [];
    if (settings?.welcome?.websiteUrl?.trim()) {
      let siteUrl = settings.welcome.websiteUrl.trim();
      if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
        siteUrl = `https://${siteUrl}`;
      }
      buttons.push({
        type: 2,
        style: 5, // Link
        label: '🌐 Website',
        url: siteUrl
      });
    }
    const redirectIds = [
      settings?.welcome?.redirectChannelId,
      settings?.welcome?.redirectChannelId2,
      settings?.welcome?.redirectChannelId3
    ].filter(Boolean);

    redirectIds.forEach(chId => {
      const chObj = channels.find(c => c.id === chId);
      const chName = chObj ? chObj.name : 'channel';
      buttons.push({
        type: 2,
        style: 5, // Link
        label: `#${chName}`,
        url: `https://discord.com/channels/${guildId}/${chId}`
      });
    });

    if (buttons.length > 0) {
      innerComponents.push({
        type: 14, // Separator
        spacing: 1,
        divider: true
      });
      innerComponents.push({
        type: 1, // Action Row
        components: buttons
      });
    }

    // Footer
    if (settings?.welcome?.embedFooterText?.trim()) {
      innerComponents.push({
        type: 10,
        content: `-# ${formatWelcomeRawString(settings.welcome.embedFooterText.trim())}`
      });
    }

    const cleanHex = (settings?.welcome?.containerAccentColor || settings?.welcome?.embedColor || '#2563eb').replace('#', '');
    const parsedHex = parseInt(cleanHex, 16);

    if (settings?.welcome?.containerWrap !== false) {
      return {
        flags: 32768,
        components: [
          {
            type: 17,
            accent_color: isNaN(parsedHex) ? 0x2563eb : parsedHex,
            components: innerComponents
          }
        ]
      };
    }

    return {
      flags: 32768,
      components: innerComponents
    };
  };

  // Custom Mass-DM Broadcast State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastButtonEnabled, setBroadcastButtonEnabled] = useState(false);
  const [broadcastButtonLabel, setBroadcastButtonLabel] = useState('');
  const [broadcastButtonUrl, setBroadcastButtonUrl] = useState('');
  const [broadcastButtons, setBroadcastButtons] = useState([]); // Multiple buttons support
  const [broadcastEmbedEnabled, setBroadcastEmbedEnabled] = useState(false);
  const [broadcastEmbedTitle, setBroadcastEmbedTitle] = useState('');
  const [broadcastEmbedDesc, setBroadcastEmbedDesc] = useState('');
  const [broadcastEmbedColor, setBroadcastEmbedColor] = useState('#2563eb');
  const [broadcastEmbedThumb, setBroadcastEmbedThumb] = useState('');
  const [broadcastEmbedImage, setBroadcastEmbedImage] = useState('');

  // Expanded Mass DM embed customization
  const [broadcastEmbedAuthorEnabled, setBroadcastEmbedAuthorEnabled] = useState(false);
  const [broadcastEmbedAuthorName, setBroadcastEmbedAuthorName] = useState('');
  const [broadcastEmbedAuthorIcon, setBroadcastEmbedAuthorIcon] = useState('');
  const [broadcastEmbedAuthorUrl, setBroadcastEmbedAuthorUrl] = useState('');
  const [broadcastEmbedFooterEnabled, setBroadcastEmbedFooterEnabled] = useState(false);
  const [broadcastEmbedFooterText, setBroadcastEmbedFooterText] = useState('');
  const [broadcastEmbedFooterIcon, setBroadcastEmbedFooterIcon] = useState('');
  const [broadcastEmbedFields, setBroadcastEmbedFields] = useState([]);

  // Mass DM filters
  const [broadcastExcludeRole, setBroadcastExcludeRole] = useState('');
  const [broadcastDelayInterval, setBroadcastDelayInterval] = useState(1);
  const [broadcastIsScheduled, setBroadcastIsScheduled] = useState(false);
  const [broadcastScheduledTime, setBroadcastScheduledTime] = useState('');
  const [scheduledDMs, setScheduledDMs] = useState([]);
  const [broadcastsList, setBroadcastsList] = useState([]);

  // Active broadcast progress tracking
  const [activeBroadcastProgress, setActiveBroadcastProgress] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);

  // Channel Publisher State
  const [pubChannelId, setPubChannelId] = useState('');
  const [pubMessage, setPubMessage] = useState('');
  const [pubButtonEnabled, setPubButtonEnabled] = useState(false);
  const [pubButtonLabel, setPubButtonLabel] = useState('');
  const [pubButtonUrl, setPubButtonUrl] = useState('');

  // Emoji Picker State
  const [guildEmojis, setGuildEmojis] = useState([]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [emojiPickerCallback, setEmojiPickerCallback] = useState(null);

  const openEmojiPicker = (onSelect) => {
    setEmojiPickerCallback(() => onSelect);
    setEmojiPickerOpen(true);
  };

  // Expanded announcement features state hooks
  const [pubPingType, setPubPingType] = useState('none'); // 'none' | 'everyone' | 'here' | 'role'
  const [pubPingRoleId, setPubPingRoleId] = useState('');
  const [pubButtons, setPubButtons] = useState([]); // Array of { label, url }
  const [pubEmbedAuthorEnabled, setPubEmbedAuthorEnabled] = useState(false);
  const [pubEmbedAuthorName, setPubEmbedAuthorName] = useState('');
  const [pubEmbedAuthorIcon, setPubEmbedAuthorIcon] = useState('');
  const [pubEmbedAuthorUrl, setPubEmbedAuthorUrl] = useState('');
  const [pubEmbedFooterEnabled, setPubEmbedFooterEnabled] = useState(false);
  const [pubEmbedFooterText, setPubEmbedFooterText] = useState('');
  const [pubEmbedFooterIcon, setPubEmbedFooterIcon] = useState('');
  const [pubEmbedFields, setPubEmbedFields] = useState([]); // Array of { name, value, inline }

  const [pubEmbedEnabled, setPubEmbedEnabled] = useState(false);
  const [pubEmbedTitle, setPubEmbedTitle] = useState('');
  const [pubEmbedDesc, setPubEmbedDesc] = useState('');
  const [pubEmbedColor, setPubEmbedColor] = useState('#2563eb');
  const [pubEmbedThumb, setPubEmbedThumb] = useState('');
  const [pubEmbedImage, setPubEmbedImage] = useState('');
  const [publishing, setPublishing] = useState(false);

  const [resolvingChannel, setResolvingChannel] = useState(false);
  const [resolveSuccessMsg, setResolveSuccessMsg] = useState('');

  const handleResolveYoutubeChannel = async () => {
    const channelUrlInput = settings?.youtube?.channelUrl;
    if (!channelUrlInput) {
      setErrorMsg('Please enter a YouTube channel URL or handle.');
      return;
    }

    setResolvingChannel(true);
    setResolveSuccessMsg('');
    setErrorMsg(null);
    try {
      const res = await api.resolveYoutubeChannel(guildId, channelUrlInput);
      handleInputChange('youtube.channelId', res.channelId);
      handleInputChange('youtube.channelName', res.channelName);
      handleInputChange('youtube.channelUrl', res.channelUrl);
      setResolveSuccessMsg(`Successfully connected to channel: ${res.channelName}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to resolve YouTube channel.');
    } finally {
      setResolvingChannel(false);
    }
  };

  // Scheduling & Template states
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledAnnouncements, setScheduledAnnouncements] = useState([]);

  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateTypeForModal, setTemplateTypeForModal] = useState('announcement');

  // Premium Polls State Hooks
  const [polls, setPolls] = useState([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollChannelId, setPollChannelId] = useState('');
  const [pollMultipleChoice, setPollMultipleChoice] = useState(false);
  const [pollAnonymous, setPollAnonymous] = useState(false);
  const [pollShowResultsBeforeEnding, setPollShowResultsBeforeEnding] = useState(true);
  const [pollExpiresAt, setPollExpiresAt] = useState('');
  const [pollColor, setPollColor] = useState('#2563eb');
  const [pollImageUrl, setPollImageUrl] = useState('');
  const [pollThumbnailUrl, setPollThumbnailUrl] = useState('');
  const [creatingPoll, setCreatingPoll] = useState(false);

  // Server Giveaways State Hooks
  const [giveaways, setGiveaways] = useState([]);
  const [giveawayPrize, setGiveawayPrize] = useState('');
  const [giveawayDescription, setGiveawayDescription] = useState('');
  const [giveawayChannelId, setGiveawayChannelId] = useState('');
  const [giveawayWinnerCount, setGiveawayWinnerCount] = useState(1);
  const [giveawayDuration, setGiveawayDuration] = useState('1h');
  const [giveawayCustomEndsAt, setGiveawayCustomEndsAt] = useState('');
  const [giveawayColor, setGiveawayColor] = useState('#8b5cf6');
  const [giveawayRequireRole, setGiveawayRequireRole] = useState('');
  const [giveawayPingType, setGiveawayPingType] = useState('none');
  const [giveawayPingRoleId, setGiveawayPingRoleId] = useState('');
  const [giveawayImageUrl, setGiveawayImageUrl] = useState('');
  const [giveawayThumbnailUrl, setGiveawayThumbnailUrl] = useState('');
  const [creatingGiveaway, setCreatingGiveaway] = useState(false);
  const [giveawayFilter, setGiveawayFilter] = useState('all'); // 'all', 'active', 'ended'
  const [selectedGiveawayForParticipants, setSelectedGiveawayForParticipants] = useState(null);
  const [giveawayParticipants, setGiveawayParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedWinnerIds, setSelectedWinnerIds] = useState([]);
  const [savingManualWinners, setSavingManualWinners] = useState(false);
  const [participantsModalTab, setParticipantsModalTab] = useState('all'); // 'all', 'selected'

  // Auto Moderation / Word Filter State Hooks
  const [wordFilterInput, setWordFilterInput] = useState('');
  const [wordFilterSearch, setWordFilterSearch] = useState('');
  const [showWordBulkModal, setShowWordBulkModal] = useState(false);
  const [wordBulkText, setWordBulkText] = useState('');
  const [wordFilterTestInput, setWordFilterTestInput] = useState('');
  const [wordWhitelistSearchQuery, setWordWhitelistSearchQuery] = useState('');

  const testWordFilter = (input, wordsList, strictMode = true) => {
    if (!input || !wordsList || wordsList.length === 0) {
      return { containsForbidden: false, detectedWord: null, matchedPattern: null };
    }
    const cleanInput = input.toLowerCase();
    const normalizedInput = input.toLowerCase().replace(/[^a-z0-9]/gi, '');

    for (const word of wordsList) {
      const w = word.trim().toLowerCase();
      if (!w) continue;
      if (cleanInput.includes(w)) {
        return { containsForbidden: true, detectedWord: w, matchedPattern: 'Direct Match' };
      }
      const cleanW = w.replace(/[^a-z0-9]/gi, '');
      if (strictMode && cleanW && normalizedInput.includes(cleanW)) {
        return { containsForbidden: true, detectedWord: w, matchedPattern: 'Separator / Anti-Bypass Match' };
      }
    }
    return { containsForbidden: false, detectedWord: null, matchedPattern: null };
  };




  const handleSendBroadcast = async (e) => {
    if (e) e.preventDefault();
    if (!broadcastMessage && (!broadcastEmbedEnabled || (!broadcastEmbedTitle && !broadcastEmbedDesc && broadcastEmbedFields.length === 0))) {
      setErrorMsg('Please enter a message or set up a valid embed title/description.');
      return;
    }

    if (broadcastIsScheduled && !broadcastScheduledTime) {
      setErrorMsg('Please select a release date & time for your scheduled broadcast.');
      return;
    }

    // Validation for link buttons
    let targetButtons = [...broadcastButtons];
    if (broadcastButtonEnabled && broadcastButtonLabel && broadcastButtonUrl) {
      targetButtons.push({ label: broadcastButtonLabel, url: broadcastButtonUrl });
    }
    const invalidButton = targetButtons.find(btn => !btn.label || !btn.url);
    if (invalidButton) {
      setErrorMsg('All enabled buttons must have a valid label and URL.');
      return;
    }

    if (!window.confirm(broadcastIsScheduled
      ? `Are you sure you want to schedule this DM broadcast to members of ${guildName}?`
      : `Are you sure you want to broadcast this DM to members of ${guildName}? This action cannot be undone.`
    )) {
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      message: broadcastMessage,
      buttons: targetButtons,
      filterRole: '',
      excludeRole: broadcastExcludeRole,
      delayInterval: Number(broadcastDelayInterval) || 1,
      embed: {
        enabled: broadcastEmbedEnabled,
        title: broadcastEmbedTitle,
        description: broadcastEmbedDesc,
        color: broadcastEmbedColor,
        thumbnail: broadcastEmbedThumb,
        image: broadcastEmbedImage,
        author: {
          enabled: broadcastEmbedAuthorEnabled,
          name: broadcastEmbedAuthorName,
          iconURL: broadcastEmbedAuthorIcon,
          url: broadcastEmbedAuthorUrl
        },
        footer: {
          enabled: broadcastEmbedFooterEnabled,
          text: broadcastEmbedFooterText,
          iconURL: broadcastEmbedFooterIcon
        },
        fields: broadcastEmbedFields
      }
    };

    try {
      if (broadcastIsScheduled) {
        payload.publishAt = broadcastScheduledTime;
        const res = await api.scheduleDM(guildId, payload);
        showNotification(res.message || 'Mass DM broadcast successfully scheduled!');
        fetchScheduledDMs();
      } else {
        setBroadcasting(true);
        setActiveBroadcastProgress({
          status: 'sending',
          totalTargets: 0,
          successCount: 0,
          failCount: 0
        });
        const res = await api.sendMassDM(guildId, payload);
        showNotification(res.message || 'Mass DM broadcast successfully started!');
        fetchBroadcastsHistory();
      }

      // Reset form
      setBroadcastMessage('');
      setBroadcastButtonEnabled(false);
      setBroadcastButtonLabel('');
      setBroadcastButtonUrl('');
      setBroadcastButtons([]);
      setBroadcastEmbedEnabled(false);
      setBroadcastEmbedTitle('');
      setBroadcastEmbedDesc('');
      setBroadcastEmbedThumb('');
      setBroadcastEmbedImage('');
      setBroadcastEmbedAuthorEnabled(false);
      setBroadcastEmbedAuthorName('');
      setBroadcastEmbedAuthorIcon('');
      setBroadcastEmbedAuthorUrl('');
      setBroadcastEmbedFooterEnabled(false);
      setBroadcastEmbedFooterText('');
      setBroadcastEmbedFooterIcon('');
      setBroadcastEmbedFields([]);
      setBroadcastExcludeRole('');
      setBroadcastDelayInterval(1);
      setBroadcastIsScheduled(false);
      setBroadcastScheduledTime('');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to trigger broadcast DMs.');
      if (!broadcastIsScheduled) {
        setActiveBroadcastProgress(null);
      }
    } finally {
      setBroadcasting(false);
    }
  };

  const handleSendTestDM = async (e) => {
    if (e) e.preventDefault();
    if (!broadcastMessage && (!broadcastEmbedEnabled || (!broadcastEmbedTitle && !broadcastEmbedDesc && broadcastEmbedFields.length === 0))) {
      setErrorMsg('Please enter a message or set up a valid embed title/description before testing.');
      return;
    }

    let targetButtons = [...broadcastButtons];
    if (broadcastButtonEnabled && broadcastButtonLabel && broadcastButtonUrl) {
      targetButtons.push({ label: broadcastButtonLabel, url: broadcastButtonUrl });
    }

    try {
      showNotification('Sending test DM to your Discord account...');
      const res = await api.sendTestDM(guildId, {
        message: broadcastMessage,
        buttons: targetButtons,
        embed: {
          enabled: broadcastEmbedEnabled,
          title: broadcastEmbedTitle,
          description: broadcastEmbedDesc,
          color: broadcastEmbedColor,
          thumbnail: broadcastEmbedThumb,
          image: broadcastEmbedImage,
          author: {
            enabled: broadcastEmbedAuthorEnabled,
            name: broadcastEmbedAuthorName,
            iconURL: broadcastEmbedAuthorIcon,
            url: broadcastEmbedAuthorUrl
          },
          footer: {
            enabled: broadcastEmbedFooterEnabled,
            text: broadcastEmbedFooterText,
            iconURL: broadcastEmbedFooterIcon
          },
          fields: broadcastEmbedFields
        }
      });
      showNotification(res.message || 'Test DM sent successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send test DM.');
    }
  };

  const handleSendChannelMessage = async (e) => {
    if (e) e.preventDefault();
    if (!pubChannelId) {
      setErrorMsg('Please select a target channel.');
      return;
    }

    if (!pubMessage && (!pubEmbedEnabled || (!pubEmbedTitle && !pubEmbedDesc && pubEmbedFields.length === 0))) {
      setErrorMsg('Please enter a message, embed content, or add fields to send.');
      return;
    }

    if (isScheduled && !scheduledTime) {
      setErrorMsg('Please select a release date & time for your scheduled announcement.');
      return;
    }

    // Validation for link buttons
    let targetButtons = [...pubButtons];
    if (pubButtonEnabled && pubButtonLabel && pubButtonUrl) {
      targetButtons.push({ label: pubButtonLabel, url: pubButtonUrl });
    }
    const invalidButton = targetButtons.find(btn => !btn.label || !btn.url);
    if (invalidButton) {
      setErrorMsg('All enabled buttons must have a valid label and URL.');
      return;
    }

    const channelName = channels.find(c => c.id === pubChannelId)?.name || 'selected channel';

    if (isScheduled) {
      if (!window.confirm(`Are you sure you want to schedule this announcement to #${channelName} at ${new Date(scheduledTime).toLocaleString()}?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to send this styled message to #${channelName}?`)) {
        return;
      }
    }

    setPublishing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        channelId: pubChannelId,
        message: pubMessage,
        ping: {
          type: pubPingType,
          roleId: pubPingRoleId
        },
        buttons: targetButtons,
        embed: {
          enabled: pubEmbedEnabled,
          title: pubEmbedTitle,
          description: pubEmbedDesc,
          color: pubEmbedColor,
          thumbnail: pubEmbedThumb,
          image: pubEmbedImage,
          author: {
            enabled: pubEmbedAuthorEnabled,
            name: pubEmbedAuthorName,
            iconURL: pubEmbedAuthorIcon,
            url: pubEmbedAuthorUrl
          },
          footer: {
            enabled: pubEmbedFooterEnabled,
            text: pubEmbedFooterText,
            iconURL: pubEmbedFooterIcon
          },
          fields: pubEmbedFields
        }
      };

      if (isScheduled) {
        payload.publishAt = scheduledTime;
        const res = await api.scheduleAnnouncement(guildId, payload);
        showNotification(res.message || 'Announcement scheduled successfully!');
        fetchScheduledAnnouncements();
      } else {
        const res = await api.sendChannelMessage(guildId, payload);
        showNotification(res.message || 'Announcement published successfully!');
      }

      // Reset form
      setPubMessage('');
      setPubPingType('none');
      setPubPingRoleId('');
      setPubButtons([]);
      setPubButtonEnabled(false);
      setPubButtonLabel('');
      setPubButtonUrl('');
      setPubEmbedEnabled(false);
      setPubEmbedTitle('');
      setPubEmbedDesc('');
      setPubEmbedThumb('');
      setPubEmbedImage('');
      setPubEmbedAuthorEnabled(false);
      setPubEmbedAuthorName('');
      setPubEmbedAuthorIcon('');
      setPubEmbedAuthorUrl('');
      setPubEmbedFooterEnabled(false);
      setPubEmbedFooterText('');
      setPubEmbedFooterIcon('');
      setPubEmbedFields([]);
      setIsScheduled(false);
      setScheduledTime('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process request.');
    } finally {
      setPublishing(false);
    }
  };

  // Templates Management Helpers
  const fetchTemplates = async (type) => {
    try {
      const data = await api.getTemplates(guildId, type);
      setTemplates(data);
    } catch (err) {
      console.error('Failed to fetch templates:', err.message);
    }
  };

  const handleSaveTemplate = async (name, type) => {
    if (!name.trim()) return;
    try {
      let data = {};
      if (type === 'announcement') {
        data = {
          message: pubMessage,
          pubPingType,
          pubPingRoleId,
          pubButtons,
          pubButtonEnabled,
          pubButtonLabel,
          pubButtonUrl,
          pubEmbedEnabled,
          pubEmbedTitle,
          pubEmbedDesc,
          pubEmbedColor,
          pubEmbedThumb,
          pubEmbedImage,
          pubEmbedAuthorEnabled,
          pubEmbedAuthorName,
          pubEmbedAuthorIcon,
          pubEmbedAuthorUrl,
          pubEmbedFooterEnabled,
          pubEmbedFooterText,
          pubEmbedFooterIcon,
          pubEmbedFields
        };
      } else {
        data = {
          message: broadcastMessage,
          broadcastExcludeRole,
          broadcastButtons,
          broadcastButtonEnabled,
          broadcastButtonLabel,
          broadcastButtonUrl,
          broadcastEmbedEnabled,
          broadcastEmbedTitle,
          broadcastEmbedDesc,
          broadcastEmbedColor,
          broadcastEmbedThumb,
          broadcastEmbedImage,
          broadcastEmbedAuthorEnabled,
          broadcastEmbedAuthorName,
          broadcastEmbedAuthorIcon,
          broadcastEmbedAuthorUrl,
          broadcastEmbedFooterEnabled,
          broadcastEmbedFooterText,
          broadcastEmbedFooterIcon,
          broadcastEmbedFields,
          broadcastDelayInterval
        };
      }

      await api.saveTemplate(guildId, { name, type, data });
      showNotification('Template saved successfully!');
      fetchTemplates(type);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save template.');
    }
  };

  const handleLoadTemplate = (tpl) => {
    const { data } = tpl;
    if (tpl.type === 'announcement') {
      setPubMessage(data.message || '');
      setPubPingType(data.pubPingType || 'none');
      setPubPingRoleId(data.pubPingRoleId || '');
      setPubButtons(data.pubButtons || []);
      setPubButtonEnabled(!!data.pubButtonEnabled);
      setPubButtonLabel(data.pubButtonLabel || '');
      setPubButtonUrl(data.pubButtonUrl || '');
      setPubEmbedEnabled(!!data.pubEmbedEnabled);
      setPubEmbedTitle(data.pubEmbedTitle || '');
      setPubEmbedDesc(data.pubEmbedDesc || '');
      setPubEmbedColor(data.pubEmbedColor || '#2563eb');
      setPubEmbedThumb(data.pubEmbedThumb || '');
      setPubEmbedImage(data.pubEmbedImage || '');
      setPubEmbedAuthorEnabled(!!data.pubEmbedAuthorEnabled);
      setPubEmbedAuthorName(data.pubEmbedAuthorName || '');
      setPubEmbedAuthorIcon(data.pubEmbedAuthorIcon || '');
      setPubEmbedAuthorUrl(data.pubEmbedAuthorUrl || '');
      setPubEmbedFooterEnabled(!!data.pubEmbedFooterEnabled);
      setPubEmbedFooterText(data.pubEmbedFooterText || '');
      setPubEmbedFooterIcon(data.pubEmbedFooterIcon || '');
      setPubEmbedFields(data.pubEmbedFields || []);
    } else {
      setBroadcastMessage(data.message || '');
      setBroadcastExcludeRole(data.broadcastExcludeRole || '');
      setBroadcastButtons(data.broadcastButtons || []);
      setBroadcastButtonEnabled(!!data.broadcastButtonEnabled);
      setBroadcastButtonLabel(data.broadcastButtonLabel || '');
      setBroadcastButtonUrl(data.broadcastButtonUrl || '');
      setBroadcastEmbedEnabled(!!data.broadcastEmbedEnabled);
      setBroadcastEmbedTitle(data.broadcastEmbedTitle || '');
      setBroadcastEmbedDesc(data.broadcastEmbedDesc || '');
      setBroadcastEmbedColor(data.broadcastEmbedColor || '#2563eb');
      setBroadcastEmbedThumb(data.broadcastEmbedThumb || '');
      setBroadcastEmbedImage(data.broadcastEmbedImage || '');
      setBroadcastEmbedAuthorEnabled(!!data.broadcastEmbedAuthorEnabled);
      setBroadcastEmbedAuthorName(data.broadcastEmbedAuthorName || '');
      setBroadcastEmbedAuthorIcon(data.broadcastEmbedAuthorIcon || '');
      setBroadcastEmbedAuthorUrl(data.broadcastEmbedAuthorUrl || '');
      setBroadcastEmbedFooterEnabled(!!data.broadcastEmbedFooterEnabled);
      setBroadcastEmbedFooterText(data.broadcastEmbedFooterText || '');
      setBroadcastEmbedFooterIcon(data.broadcastEmbedFooterIcon || '');
      setBroadcastEmbedFields(data.broadcastEmbedFields || []);
      setBroadcastDelayInterval(data.broadcastDelayInterval || 1);
    }
    showNotification(`Template "${tpl.name}" loaded successfully.`);
  };

  const handleDeleteTemplate = async (templateId, type) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.deleteTemplate(guildId, templateId);
      showNotification('Template deleted successfully.');
      fetchTemplates(type);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete template.');
    }
  };

  // Scheduled Announcements helpers
  const fetchScheduledAnnouncements = async () => {
    try {
      const data = await api.getScheduledAnnouncements(guildId);
      setScheduledAnnouncements(data);
    } catch (err) {
      console.error('Failed to fetch scheduled announcements:', err.message);
    }
  };

  const handleDeleteScheduledAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this scheduled announcement?')) return;
    try {
      await api.deleteScheduledAnnouncement(guildId, announcementId);
      showNotification('Scheduled announcement cancelled.');
      fetchScheduledAnnouncements();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel scheduled announcement.');
    }
  };

  // Scheduled DMs & Broadcast History helpers
  const fetchScheduledDMs = async () => {
    try {
      const data = await api.getScheduledDMs(guildId);
      setScheduledDMs(data);
    } catch (err) {
      console.error('Failed to fetch scheduled DMs:', err.message);
    }
  };

  const fetchBroadcastsHistory = async () => {
    try {
      const data = await api.getBroadcasts(guildId);
      setBroadcastsList(data);
    } catch (err) {
      console.error('Failed to fetch broadcasts history:', err.message);
    }
  };

  const handleDeleteScheduledDM = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this scheduled DM broadcast?')) return;
    try {
      await api.deleteScheduledDM(guildId, id);
      showNotification('Scheduled DM broadcast cancelled.');
      fetchScheduledDMs();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel scheduled DM broadcast.');
    }
  };

  const handleRevokeBroadcast = async (broadcastId) => {
    if (!window.confirm('WARNING: This will attempt to delete this message for all users who received it. Are you sure you want to proceed?')) return;
    try {
      await api.revokeBroadcast(guildId, broadcastId);
      showNotification('DM Revocation process started in the background.');
      fetchBroadcastsHistory();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start DM revocation.');
    }
  };

  // Active Broadcast Cancellation
  const handleCancelActiveBroadcast = async (broadcastId) => {
    if (!window.confirm('Are you sure you want to stop this running broadcast immediately?')) return;
    try {
      const res = await api.cancelBroadcast(guildId, broadcastId);
      showNotification(res.message || 'Broadcast cancel request sent.');
      fetchBroadcastsHistory();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel running broadcast.');
    }
  };

  // Premium Poll Helpers
  const fetchPolls = async () => {
    try {
      const data = await api.getPolls(guildId);
      setPolls(data);
    } catch (err) {
      console.error('Failed to fetch polls:', err.message);
    }
  };

  const handleCreatePoll = async (e) => {
    if (e) e.preventDefault();
    if (!pollChannelId) {
      setErrorMsg('Please select a target channel.');
      return;
    }
    if (!pollQuestion.trim()) {
      setErrorMsg('Please enter a question.');
      return;
    }
    const filteredOptions = pollOptions.map(opt => opt.trim()).filter(Boolean);
    if (filteredOptions.length < 2) {
      setErrorMsg('Please enter at least two options.');
      return;
    }

    setCreatingPoll(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      channelId: pollChannelId,
      question: pollQuestion,
      description: pollDescription,
      options: filteredOptions,
      settings: {
        multipleChoice: pollMultipleChoice,
        anonymous: pollAnonymous,
        showResultsBeforeEnding: pollShowResultsBeforeEnding,
        expiresAt: pollExpiresAt || undefined,
        color: pollColor,
        imageUrl: pollImageUrl || undefined,
        thumbnailUrl: pollThumbnailUrl || undefined
      }
    };

    try {
      await api.createPoll(guildId, payload);
      showNotification('Poll created and published to Discord successfully!');

      // Reset form
      setPollQuestion('');
      setPollDescription('');
      setPollOptions(['', '']);
      setPollMultipleChoice(false);
      setPollAnonymous(false);
      setPollShowResultsBeforeEnding(true);
      setPollExpiresAt('');
      setPollColor('#2563eb');
      setPollImageUrl('');
      setPollThumbnailUrl('');

      fetchPolls();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create poll.');
    } finally {
      setCreatingPoll(false);
    }
  };

  const handleEndPoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to end this poll immediately? Voters will not be able to vote anymore.')) return;
    try {
      await api.endPoll(guildId, pollId);
      showNotification('Poll ended successfully.');
      fetchPolls();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to end poll.');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? The Discord message will be deleted, and all vote data will be removed.')) return;
    try {
      await api.deletePoll(guildId, pollId);
      showNotification('Poll deleted successfully.');
      fetchPolls();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete poll.');
    }
  };

  // Server Giveaways Helpers
  const fetchGiveaways = async () => {
    try {
      const data = await api.getGiveaways(guildId);
      setGiveaways(data || []);
    } catch (err) {
      console.error('Failed to fetch giveaways:', err.message);
    }
  };

  const handleCreateGiveaway = async (e) => {
    if (e) e.preventDefault();
    if (!giveawayChannelId) {
      setErrorMsg('Please select a target Discord channel.');
      return;
    }
    if (!giveawayPrize.trim()) {
      setErrorMsg('Giveaway prize title is required.');
      return;
    }

    setCreatingGiveaway(true);
    setErrorMsg(null);
    try {
      const payload = {
        channelId: giveawayChannelId,
        prize: giveawayPrize.trim(),
        description: giveawayDescription.trim(),
        winnerCount: parseInt(giveawayWinnerCount, 10) || 1,
        duration: giveawayCustomEndsAt ? undefined : giveawayDuration,
        endsAt: giveawayCustomEndsAt ? new Date(giveawayCustomEndsAt).toISOString() : undefined,
        settings: {
          color: giveawayColor,
          requireRole: giveawayRequireRole || undefined,
          pingType: giveawayPingType,
          pingRoleId: giveawayPingRoleId || undefined,
          imageUrl: giveawayImageUrl.trim() || undefined,
          thumbnailUrl: giveawayThumbnailUrl.trim() || undefined
        }
      };

      await api.createGiveaway(guildId, payload);
      showNotification('🎉 Giveaway created and broadcasted to Discord successfully!');
      setGiveawayPrize('');
      setGiveawayDescription('');
      setGiveawayCustomEndsAt('');
      setGiveawayRequireRole('');
      setGiveawayPingType('none');
      setGiveawayPingRoleId('');
      setGiveawayImageUrl('');
      setGiveawayThumbnailUrl('');
      fetchGiveaways();
    } catch (err) {
      console.error('Failed to create giveaway:', err);
      setErrorMsg(err.message || 'Failed to create giveaway.');
    } finally {
      setCreatingGiveaway(false);
    }
  };

  const handleEndGiveaway = async (giveawayId) => {
    if (!window.confirm('Are you sure you want to end this giveaway early and draw the winners now?')) return;
    try {
      await api.endGiveaway(guildId, giveawayId);
      showNotification('Giveaway ended and winner(s) announced in Discord!');
      fetchGiveaways();
    } catch (err) {
      console.error('Failed to end giveaway:', err);
      setErrorMsg(err.message || 'Failed to end giveaway.');
    }
  };

  const handleRerollGiveaway = async (giveawayId) => {
    if (!window.confirm('Are you sure you want to reroll a new winner from the participants?')) return;
    try {
      await api.rerollGiveaway(guildId, giveawayId);
      showNotification('🔄 Giveaway rerolled and new winner announced in Discord!');
      fetchGiveaways();
    } catch (err) {
      console.error('Failed to reroll giveaway:', err);
      setErrorMsg(err.message || 'Failed to reroll giveaway.');
    }
  };

  const handleDeleteGiveaway = async (giveawayId) => {
    if (!window.confirm('Are you sure you want to delete this giveaway record? The message will also be removed from Discord.')) return;
    try {
      await api.deleteGiveaway(guildId, giveawayId);
      showNotification('Giveaway deleted successfully.');
      fetchGiveaways();
    } catch (err) {
      console.error('Failed to delete giveaway:', err);
      setErrorMsg(err.message || 'Failed to delete giveaway.');
    }
  };

  const handleOpenParticipantsModal = async (ga, initialMode = 'view') => {
    setSelectedGiveawayForParticipants(ga);
    setLoadingParticipants(true);
    setParticipantSearch('');
    const existingWinnerIds = (ga.winners || []).map(w => w.id);
    setSelectedWinnerIds(existingWinnerIds);
    setParticipantsModalTab(initialMode === 'select' && existingWinnerIds.length > 0 ? 'selected' : 'all');

    try {
      const res = await api.getGiveawayParticipants(guildId, ga._id);
      setGiveawayParticipants(res.participants || []);
    } catch (err) {
      console.error('Failed to load giveaway participants:', err);
      setErrorMsg(err.message || 'Failed to load participants.');
      setGiveawayParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleToggleWinnerSelection = (userId) => {
    setSelectedWinnerIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleQuickPickRandom = (count) => {
    if (!giveawayParticipants || giveawayParticipants.length === 0) return;
    const pool = [...giveawayParticipants.map(p => p.id)];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setSelectedWinnerIds(pool.slice(0, Math.min(count, pool.length)));
  };

  const handleSaveManualWinners = async () => {
    if (!selectedGiveawayForParticipants) return;
    if (selectedWinnerIds.length === 0) {
      setErrorMsg('Please select at least one participant as a winner.');
      return;
    }

    setSavingManualWinners(true);
    setErrorMsg(null);
    try {
      await api.setManualGiveawayWinners(guildId, selectedGiveawayForParticipants._id, selectedWinnerIds);
      showNotification('🎉 Manual winner(s) saved and announced in Discord!');
      setSelectedGiveawayForParticipants(null);
      fetchGiveaways();
    } catch (err) {
      console.error('Failed to set manual winners:', err);
      setErrorMsg(err.message || 'Failed to set manual winners.');
    } finally {
      setSavingManualWinners(false);
    }
  };

  // Load Channels, Roles, and Settings
  const loadData = async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) setLoading(true);
      const [chData, rData, sData, catData, vcData, emojiData] = await Promise.all([
        api.getChannels(guildId),
        api.getRoles(guildId),
        api.getSettings(guildId),
        api.getCategories(guildId),
        api.getVoiceChannels(guildId),
        api.getEmojis(guildId).catch(() => [])
      ]);
      setChannels(chData);
      setRoles(rData);
      setGuildEmojis(emojiData || []);
      if (sData) {
        if (!sData.logging) {
          sData.logging = {
            enabled: true,
            logChannelId: '',
            logBans: true,
            logKicks: true,
            logMutes: true,
            logVoice: true,
            logRoles: true,
            logChannels: true,
            logMessages: true,
            logMembers: true
          };
        }
        if (!sData.antinuke) {
          sData.antinuke = {
            enabled: false,
            logChannelId: '',
            punishment: 'stripall',
            threshold: 3,
            timeframe: 60,
            antiBan: true,
            antiKick: true,
            antiChannelCreate: true,
            antiChannelDelete: true,
            antiRoleCreate: true,
            antiRoleDelete: true,
            antiRoleUpdate: true,
            antiWebhook: true,
            antiBot: true,
            antiGuildUpdate: false,
            antiEmoji: false,
            antiChannelEdit: false,
            whitelistedUsers: []
          };
        } else {
          if (!sData.antinuke.whitelistedUsers) {
            sData.antinuke.whitelistedUsers = [];
          } else {
            sData.antinuke.whitelistedUsers = sData.antinuke.whitelistedUsers.map(u =>
              typeof u === 'string' ? { userId: u, addedBy: 'System', events: [], username: '', displayName: '', avatar: '' } : u
            );
          }
        }

        if (sData.moderation) {
          if (!sData.moderation.fullWhitelist) {
            sData.moderation.fullWhitelist = { enabled: true };
          }
          if (!Array.isArray(sData.moderation.whitelistedUsers)) {
            sData.moderation.whitelistedUsers = [];
          } else {
            sData.moderation.whitelistedUsers = sData.moderation.whitelistedUsers.map(u =>
              typeof u === 'string' ? { userId: u, addedBy: 'System', username: '', displayName: '', avatar: '', addedAt: new Date() } : u
            );
          }
          if (!Array.isArray(sData.moderation.whitelistedRoles)) {
            sData.moderation.whitelistedRoles = [];
          } else {
            sData.moderation.whitelistedRoles = sData.moderation.whitelistedRoles.map(r =>
              typeof r === 'string' ? { roleId: r, name: '', color: '' } : r
            );
          }
          if (!Array.isArray(sData.moderation.whitelistedChannels)) {
            sData.moderation.whitelistedChannels = [];
          }
          if (!sData.moderation.wordFilter) {
            sData.moderation.wordFilter = {
              enabled: false,
              autoDelete: true,
              autoTimeout: true,
              words: [],
              action: 'delete_timeout',
              timeoutDuration: 10,
              logChannelId: '',
              sendAlert: true,
              alertMessage: '{user}, your message contained a forbidden word and was removed.',
              strictBypassProtection: true,
              whitelistedUsers: [],
              whitelistedRoles: []
            };
          }
        } else {
          sData.moderation = {
            spam: { enabled: false, protectedChannels: [], maxMessages: 5, timeWindow: 5000, timeoutDuration: 5 },
            links: { enabled: false, protectedChannels: [], allowedLinks: [] },
            photoSpam: { enabled: false, maxPhotos: 3, timeWindow: 10000, timeoutDuration: 10, whitelistedChannels: [] },
            fullWhitelist: { enabled: true },
            whitelistedUsers: [],
            whitelistedRoles: [],
            whitelistedChannels: [],
            wordFilter: {
              enabled: false,
              autoDelete: true,
              autoTimeout: true,
              words: [],
              action: 'delete_timeout',
              timeoutDuration: 10,
              logChannelId: '',
              sendAlert: true,
              alertMessage: '{user}, your message contained a forbidden word and was removed.',
              strictBypassProtection: true,
              whitelistedUsers: [],
              whitelistedRoles: []
            }
          };
        }

        if (!sData.selfRoles) {
          sData.selfRoles = {
            enabled: false,
            channelId: '',
            title: '🍃💨 Self Roles',
            description: 'Choose your district and find people near you to chat and connect...',
            placeholder: 'Make a selection',
            mode: 'onetime',
            embedColor: '#2563eb',
            imageUrl: '',
            options: [
              { id: 'opt_1', label: 'Thiruvananthapuram', emoji: '🌴', description: 'Find people in Thiruvananthapuram', roleId: '' },
              { id: 'opt_2', label: 'Kollam', emoji: '🌴', description: 'Find people in Kollam', roleId: '' },
              { id: 'opt_3', label: 'Pathanamthitta', emoji: '🌴', description: 'Find people in Pathanamthitta', roleId: '' },
              { id: 'opt_4', label: 'Alappuzha', emoji: '🌴', description: 'Find people in Alappuzha', roleId: '' },
              { id: 'opt_5', label: 'Kottayam', emoji: '🌴', description: 'Find people in Kottayam', roleId: '' }
            ],
            panels: []
          };
        } else if (!Array.isArray(sData.selfRoles.options) || sData.selfRoles.options.length === 0) {
          sData.selfRoles.options = [
            { id: 'opt_1', label: 'Thiruvananthapuram', emoji: '🌴', description: 'Find people in Thiruvananthapuram', roleId: '' },
            { id: 'opt_2', label: 'Kollam', emoji: '🌴', description: 'Find people in Kollam', roleId: '' },
            { id: 'opt_3', label: 'Pathanamthitta', emoji: '🌴', description: 'Find people in Pathanamthitta', roleId: '' },
            { id: 'opt_4', label: 'Alappuzha', emoji: '🌴', description: 'Find people in Alappuzha', roleId: '' },
            { id: 'opt_5', label: 'Kottayam', emoji: '🌴', description: 'Find people in Kottayam', roleId: '' }
          ];
        }

        // Normalize Temp Voice configuration
        if (!sData.tempVoice) {
          sData.tempVoice = {
            enabled: false,
            channelId: '',
            categoryId: '',
            nameTemplate: "🔊 {username}'s Room",
            userLimit: 0,
            autoDisconnectOverLimit: true,
            whitelistedUsers: [],
            whitelistedRoles: [],
            channels: []
          };
        } else {
          if (sData.tempVoice.autoDisconnectOverLimit === undefined) {
            sData.tempVoice.autoDisconnectOverLimit = true;
          }
          if (!Array.isArray(sData.tempVoice.whitelistedUsers)) {
            sData.tempVoice.whitelistedUsers = [];
          }
          if (!Array.isArray(sData.tempVoice.whitelistedRoles)) {
            sData.tempVoice.whitelistedRoles = [];
          }
        }

        // Normalize Full Moderation configuration
        if (!sData.fullModeration) {
          sData.fullModeration = {
            enabled: false,
            preventRoleCreate: true,
            preventRoleGive: true,
            preventRoleDelete: true,
            preventChannelCreate: true,
            preventChannelDelete: true,
            preventMemberKick: true,
            preventMemberBan: true,
            preventMemberTimeout: true,
            preventVoiceMute: true,
            preventVoiceDisconnect: true,
            preventMessageDelete: true,
            preventServerSettings: true,
            punishment: 'strip_admin',
            timeoutDuration: 60,
            logChannelId: '',
            whitelistedUsers: [],
            whitelistedRoles: [],
            actionWhitelists: {}
          };
        } else {
          if (!Array.isArray(sData.fullModeration.whitelistedUsers)) {
            sData.fullModeration.whitelistedUsers = [];
          } else {
            sData.fullModeration.whitelistedUsers = sData.fullModeration.whitelistedUsers.map(u =>
              typeof u === 'string' ? { userId: u, addedBy: 'System', username: '', displayName: '', avatar: '' } : u
            );
          }
          if (!Array.isArray(sData.fullModeration.whitelistedRoles)) {
            sData.fullModeration.whitelistedRoles = [];
          }
          if (!sData.fullModeration.actionWhitelists || typeof sData.fullModeration.actionWhitelists !== 'object') {
            sData.fullModeration.actionWhitelists = {};
          }
        }
      }

      setSettings(sData);
      setSavedSettings(JSON.parse(JSON.stringify(sData)));
      setCategories(catData || []);
      setVoiceChannels(vcData || []);

      // Resolve current logged-in member details in this guild to verify ownership and roles
      const currentUserId = user?.discordId || user?.id;
      if (currentUserId && currentUserId !== 'admin') {
        api.getAdminMemberDetails(guildId, currentUserId).then(memberInfo => {
          if (memberInfo) {
            setCurrentMemberInfo(memberInfo);
            setAllMembers(prev => {
              if (prev.some(m => m.id === memberInfo.id)) {
                return prev.map(m => m.id === memberInfo.id ? { ...m, ...memberInfo } : m);
              }
              return [...prev, memberInfo];
            });
          }
        }).catch(() => { });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load server data. Please try again.');
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [guildId]);

  // Load members list whenever antinuke, moderation, full moderation, or temp voice tab becomes active
  useEffect(() => {
    if (activeTab === 'antinuke' || activeTab === 'moderation' || activeTab === 'fullmoderation' || activeTab === 'tempvoice') {
      const fetchMembers = async () => {
        try {
          const mData = await api.getAdminMembers(guildId).catch(() => []);
          setAllMembers(prev => {
            const antinukeIds = settings?.antinuke?.whitelistedUsers?.map(u => typeof u === 'string' ? u : u?.userId).filter(Boolean) || [];
            const moderationIds = settings?.moderation?.whitelistedUsers?.map(u => typeof u === 'string' ? u : u?.userId).filter(Boolean) || [];
            const whitelistedIds = Array.from(new Set([...antinukeIds, ...moderationIds])).filter(id => id !== 'undefined');

            const whitelistedInPrev = prev.filter(m => whitelistedIds.includes(m.id));
            const merged = [...(mData || [])];
            whitelistedInPrev.forEach(m => {
              if (!merged.some(x => x.id === m.id)) {
                merged.push(m);
              }
            });
            return merged;
          });
        } catch (err) {
          console.error('[Dashboard] Failed to fetch members:', err);
        }
      };
      fetchMembers();
    }
  }, [activeTab, guildId, settings?.antinuke?.whitelistedUsers, settings?.moderation?.whitelistedUsers]);

  // Whenever whitelistedUsers changes or allMembers changes, fetch details for any IDs we don't have cached yet
  useEffect(() => {
    const antinukeIds = settings?.antinuke?.whitelistedUsers?.map(u => typeof u === 'string' ? u : u?.userId).filter(Boolean) || [];
    const moderationIds = settings?.moderation?.whitelistedUsers?.map(u => typeof u === 'string' ? u : u?.userId).filter(Boolean) || [];
    const whitelistedIds = Array.from(new Set([...antinukeIds, ...moderationIds])).filter(id => id !== 'undefined');

    if (whitelistedIds.length === 0) return;

    const missingIds = whitelistedIds.filter(id => id && !allMembers.some(m => m.id === id) && !failedIds.has(id));
    if (missingIds.length === 0) return;

    const resolveMissing = async () => {
      const fetched = await Promise.all(
        missingIds.map(async (id) => {
          try {
            return await api.getAdminMemberDetails(guildId, id);
          } catch (e) {
            setFailedIds(prev => {
              const next = new Set(prev);
              next.add(id);
              return next;
            });
            return null;
          }
        })
      );
      const valid = fetched.filter(Boolean);
      if (valid.length > 0) {
        setAllMembers(prev => {
          const newEntries = valid.filter(v => !prev.some(m => m.id === v.id));
          return newEntries.length > 0 ? [...prev, ...newEntries] : prev;
        });
      }
    };
    resolveMissing();
  }, [settings?.antinuke?.whitelistedUsers, settings?.moderation?.whitelistedUsers, allMembers, guildId, failedIds]);

  // Debounce search effect for whitelisting members
  useEffect(() => {
    if (!memberSearchQuery.trim()) {
      setSearchedMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const membersList = await api.getAdminMembers(guildId, memberSearchQuery);
        setSearchedMembers(membersList || []);
      } catch (err) {
        console.error('[Dashboard Member Search Error]', err);
      } finally {
        setSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [memberSearchQuery, guildId]);

  // Debounce search effect for moderation whitelisting members
  useEffect(() => {
    if (!modWhitelistSearchQuery.trim()) {
      setModWhitelistSearchedMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setModWhitelistSearchLoading(true);
      try {
        const membersList = await api.getAdminMembers(guildId, modWhitelistSearchQuery);
        setModWhitelistSearchedMembers(membersList || []);
      } catch (err) {
        console.error('[Dashboard Moderation Whitelist Member Search Error]', err);
      } finally {
        setModWhitelistSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [modWhitelistSearchQuery, guildId]);

  // Debounce search effect for Full Moderation whitelisting members
  useEffect(() => {
    if (!fullModSearchQuery.trim()) {
      setFullModSearchedMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setFullModSearchLoading(true);
      try {
        const membersList = await api.getAdminMembers(guildId, fullModSearchQuery);
        setFullModSearchedMembers(membersList || []);
      } catch (err) {
        console.error('[Dashboard Full Moderation Whitelist Member Search Error]', err);
      } finally {
        setFullModSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [fullModSearchQuery, guildId]);

  // Debounce search effect for Per-Option Full Moderation whitelist
  useEffect(() => {
    if (!actionWhitelistSearchQuery.trim()) {
      setActionWhitelistSearchedMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setActionWhitelistSearchLoading(true);
      try {
        const membersList = await api.getAdminMembers(guildId, actionWhitelistSearchQuery);
        setActionWhitelistSearchedMembers(membersList || []);
      } catch (err) {
        console.error('[Action Whitelist Member Search Error]', err);
      } finally {
        setActionWhitelistSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [actionWhitelistSearchQuery, guildId]);

  // Debounce search effect for Temp Voice whitelisting members
  useEffect(() => {
    if (!tempVoiceSearchQuery.trim()) {
      setTempVoiceSearchedMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setTempVoiceSearchLoading(true);
      try {
        const membersList = await api.getAdminMembers(guildId, tempVoiceSearchQuery);
        setTempVoiceSearchedMembers(membersList || []);
      } catch (err) {
        console.error('[Dashboard Temp Voice Member Search Error]', err);
      } finally {
        setTempVoiceSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [tempVoiceSearchQuery, guildId]);

  // Initialize Socket.IO connection and join room
  useEffect(() => {
    const socketUrl = (window.location.port === '5173' || window.location.port === '5174')
      ? 'http://localhost:2049'
      : window.location.origin;

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });


    newSocket.emit('join_guild', guildId);

    newSocket.on('new_log', (log) => {
      setLogs(prev => [log, ...prev]);
    });

    newSocket.on('broadcast_progress', (progress) => {
      console.log('[Socket] Received broadcast progress:', progress);
      setActiveBroadcastProgress(progress);
      if (progress.status === 'completed' || progress.status === 'cancelled' || progress.status === 'failed') {
        fetchBroadcastsHistory();
        setTimeout(() => setActiveBroadcastProgress(null), 10000); // hide status after 10 seconds of completion
      }
    });

    newSocket.on('poll_update', (updatedPoll) => {
      setPolls(prev => {
        const index = prev.findIndex(p => p._id === updatedPoll._id);
        if (index > -1) {
          const newPolls = [...prev];
          newPolls[index] = updatedPoll;
          return newPolls;
        } else {
          return [updatedPoll, ...prev];
        }
      });
    });

    newSocket.on('poll_delete', ({ pollId }) => {
      setPolls(prev => prev.filter(p => p._id !== pollId));
    });

    newSocket.on('giveaway_update', (updatedGiveaway) => {
      setGiveaways(prev => {
        const index = prev.findIndex(g => g._id === updatedGiveaway._id);
        if (index > -1) {
          const newGAs = [...prev];
          newGAs[index] = updatedGiveaway;
          return newGAs;
        } else {
          return [updatedGiveaway, ...prev];
        }
      });
    });

    newSocket.on('giveaway_delete', ({ giveawayId }) => {
      setGiveaways(prev => prev.filter(g => g._id !== giveawayId));
    });

    return () => {
      newSocket.emit('leave_guild', guildId);
      newSocket.disconnect();
    };
  }, [guildId]);

  // Load templates & scheduled posts on tab changes
  useEffect(() => {
    if (activeTab === 'publish') {
      fetchTemplates('announcement');
      fetchScheduledAnnouncements();
    } else if (activeTab === 'broadcast') {
      fetchTemplates('dm');
      fetchScheduledDMs();
      fetchBroadcastsHistory();
      setActiveBroadcastProgress(null); // Reset preview
    } else if (activeTab === 'polls') {
      fetchPolls();
    } else if (activeTab === 'giveaways') {
      fetchGiveaways();
    }
  }, [activeTab, guildId]);

  // Load moderation logs when active tab is logs
  useEffect(() => {
    if (activeTab === 'logs') {
      const fetchLogs = async () => {
        try {
          const res = await api.getLogs(guildId);
          setLogs(res);
        } catch (err) {
          console.error('[Dashboard] Failed to fetch moderation logs:', err.message);
        }
      };
      fetchLogs();
    }
  }, [activeTab, guildId]);

  const handleDragStart = (e, elementKey) => {
    e.preventDefault();
    const parent = e.currentTarget.parentElement;
    const rect = parent.getBoundingClientRect();

    const handleMouseMove = (moveEvent) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

      let newX = ((clientX - rect.left) / rect.width) * 800;
      let newY = ((clientY - rect.top) / rect.height) * 450;

      newX = Math.round(Math.max(0, Math.min(800, newX)));
      newY = Math.round(Math.max(0, Math.min(450, newY)));

      handleInputChange(`welcome.${elementKey}X`, newX);
      handleInputChange(`welcome.${elementKey}Y`, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: true });
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleToggle = (path) => {
    const parts = path.split('.');
    setSettings(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] === undefined || current[parts[i]] === null) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = !current[parts[parts.length - 1]];
      return updated;
    });
  };

  const handleInputChange = (path, value) => {
    const parts = path.split('.');
    setSettings(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] === undefined || current[parts[i]] === null) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  const getMemberDetails = (userId) => {
    const member = allMembers.find(m => m.id === userId);
    if (member) return member;

    // Look for fallback details in settings whitelists
    const modUser = settings?.moderation?.whitelistedUsers?.find(u => u.userId === userId);
    const antiUser = settings?.antinuke?.whitelistedUsers?.find(u => typeof u === 'string' ? u === userId : u.userId === userId);

    const storedUsername = modUser?.username || (typeof antiUser === 'object' ? antiUser?.username : '');
    const storedDisplayName = modUser?.displayName || (typeof antiUser === 'object' ? antiUser?.displayName : '');
    const storedAvatar = modUser?.avatar || (typeof antiUser === 'object' ? antiUser?.avatar : '');

    return {
      id: userId,
      username: storedUsername || '',
      displayName: storedDisplayName || 'Unknown User',
      avatar: storedAvatar || null
    };
  };

  const handleAddWhitelist = (userId, events = [], details = null) => {
    if (!settings || !settings.antinuke) return;
    const currentList = settings.antinuke.whitelistedUsers || [];
    if (!currentList.some(u => u.userId === userId)) {
      const addedBy = user ? user.username : 'Dashboard';
      const username = details ? details.username : '';
      const displayName = details ? details.displayName : '';
      const avatar = details ? details.avatar : '';
      const updatedList = [...currentList, { userId, addedBy, events, username, displayName, avatar }];
      handleInputChange('antinuke.whitelistedUsers', updatedList);
    }
  };

  const handleRemoveWhitelist = (userId) => {
    if (!settings || !settings.antinuke) return;
    const currentList = settings.antinuke.whitelistedUsers || [];
    const updatedList = currentList.filter(u => u.userId !== userId);
    handleInputChange('antinuke.whitelistedUsers', updatedList);
  };

  const handleAddModWhitelist = (userId, details = null) => {
    if (!settings || !settings.moderation) return;
    const currentList = settings.moderation.whitelistedUsers || [];
    if (!currentList.some(u => (typeof u === 'string' ? u : u.userId) === userId)) {
      const addedBy = user ? user.username : 'Dashboard';
      const username = details ? details.username : '';
      const displayName = details ? details.displayName : '';
      const avatar = details ? details.avatar : '';
      const updatedList = [...currentList, { userId, addedBy, username, displayName, avatar, addedAt: new Date() }];
      handleInputChange('moderation.whitelistedUsers', updatedList);
    }
  };

  const handleRemoveModWhitelist = (userId) => {
    if (!settings || !settings.moderation) return;
    const currentList = settings.moderation.whitelistedUsers || [];
    const updatedList = currentList.filter(u => (typeof u === 'string' ? u : u.userId) !== userId);
    handleInputChange('moderation.whitelistedUsers', updatedList);
  };

  const handleToggleModRole = (role) => {
    if (!settings || !settings.moderation) return;
    const currentList = settings.moderation.whitelistedRoles || [];
    const isPresent = currentList.some(r => (typeof r === 'string' ? r : r.roleId) === role.id);
    let updated;
    if (isPresent) {
      updated = currentList.filter(r => (typeof r === 'string' ? r : r.roleId) !== role.id);
    } else {
      updated = [...currentList, { roleId: role.id, name: role.name, color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#ffffff' }];
    }
    handleInputChange('moderation.whitelistedRoles', updated);
  };

  const handleSelectAllModRoles = () => {
    if (!settings || !settings.moderation) return;
    const allFilteredRoles = roles.filter(r => r.name !== '@everyone').map(r => ({
      roleId: r.id,
      name: r.name,
      color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#ffffff'
    }));
    handleInputChange('moderation.whitelistedRoles', allFilteredRoles);
  };

  const handleClearAllModRoles = () => {
    if (!settings || !settings.moderation) return;
    handleInputChange('moderation.whitelistedRoles', []);
  };

  const handleToggleModChannel = (channelId) => {
    if (!settings || !settings.moderation) return;
    const currentList = settings.moderation.whitelistedChannels || [];
    let updated;
    if (currentList.includes(channelId)) {
      updated = currentList.filter(id => id !== channelId);
    } else {
      updated = [...currentList, channelId];
    }
    handleInputChange('moderation.whitelistedChannels', updated);
  };

  const handleSelectAllModChannels = () => {
    if (!settings || !settings.moderation) return;
    const allTextChannels = channels.map(c => c.id);
    handleInputChange('moderation.whitelistedChannels', allTextChannels);
  };

  const handleClearAllModChannels = () => {
    if (!settings || !settings.moderation) return;
    handleInputChange('moderation.whitelistedChannels', []);
  };

  const handleManualAddModWhitelist = async () => {
    const query = modWhitelistSearchQuery.trim();
    if (!query) return;

    const isId = /^\d{17,20}$/.test(query);
    if (isId) {
      let details = null;
      try {
        details = await api.getAdminMemberDetails(guildId, query);
        if (details) {
          setAllMembers(prev => {
            if (!prev.some(m => m.id === query)) {
              return [...prev, details];
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn(`[Dashboard] Member details not found for ID ${query}:`, err);
      }
      handleAddModWhitelist(query, details);
      setModWhitelistSearchQuery('');
      setModWhitelistSearchedMembers([]);
    } else {
      if (modWhitelistSearchedMembers.length > 0) {
        const firstMatch = modWhitelistSearchedMembers.find(m => !(settings.moderation.whitelistedUsers || []).some(u => (typeof u === 'string' ? u : u.userId) === m.id));
        if (firstMatch) {
          handleAddModWhitelist(firstMatch.id, firstMatch);
          setModWhitelistSearchQuery('');
          setModWhitelistSearchedMembers([]);
        }
      } else {
        alert('Please enter a valid Discord User ID (17-20 digits) or search/select a member.');
      }
    }
  };

  const handleAddFullModWhitelist = (userId, details = null) => {
    if (!settings) return;
    const currentList = settings.fullModeration?.whitelistedUsers || [];
    if (!currentList.some(u => (typeof u === 'string' ? u : u.userId) === userId)) {
      const addedBy = user ? user.username : 'Dashboard';
      const username = details ? details.username : '';
      const displayName = details ? details.displayName : '';
      const avatar = details ? details.avatar : '';
      const updatedList = [...currentList, { userId, addedBy, username, displayName, avatar, addedAt: new Date() }];
      handleInputChange('fullModeration.whitelistedUsers', updatedList);
    }
  };

  const handleRemoveFullModWhitelist = (userId) => {
    if (!settings || !settings.fullModeration) return;
    const currentList = settings.fullModeration.whitelistedUsers || [];
    const updatedList = currentList.filter(u => (typeof u === 'string' ? u : u.userId) !== userId);
    handleInputChange('fullModeration.whitelistedUsers', updatedList);
  };

  const handleManualAddFullModWhitelist = async () => {
    const query = fullModSearchQuery.trim();
    if (!query) return;

    const isId = /^\d{17,20}$/.test(query);
    if (isId) {
      let details = null;
      try {
        details = await api.getAdminMemberDetails(guildId, query);
        if (details) {
          setAllMembers(prev => {
            if (!prev.some(m => m.id === query)) {
              return [...prev, details];
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn(`[Dashboard] Member details not found for ID ${query}:`, err);
      }
      handleAddFullModWhitelist(query, details);
      setFullModSearchQuery('');
      setFullModSearchedMembers([]);
    } else {
      if (fullModSearchedMembers.length > 0) {
        const firstMatch = fullModSearchedMembers.find(m => !(settings.fullModeration?.whitelistedUsers || []).some(u => (typeof u === 'string' ? u : u.userId) === m.id));
        if (firstMatch) {
          handleAddFullModWhitelist(firstMatch.id, firstMatch);
          setFullModSearchQuery('');
          setFullModSearchedMembers([]);
        }
      } else {
        alert('Please enter a valid Discord User ID (17-20 digits) or search/select a member.');
      }
    }
  };

  const handleAddActionUserWhitelist = (actionKey, userId, details = null) => {
    if (!settings || !actionKey) return;
    const currentWhitelists = settings.fullModeration?.actionWhitelists || {};
    const actionData = currentWhitelists[actionKey] || { users: [], roles: [] };
    const currentUsers = actionData.users || [];

    if (!currentUsers.some(u => (typeof u === 'string' ? u === userId : u.userId === userId))) {
      const addedBy = user ? user.username : 'Dashboard';
      const username = details ? details.username : '';
      const displayName = details ? details.displayName : '';
      const avatar = details ? details.avatar : '';
      const updatedUsers = [...currentUsers, { userId, addedBy, username, displayName, avatar, addedAt: new Date() }];

      const updatedActionWhitelists = {
        ...currentWhitelists,
        [actionKey]: {
          ...actionData,
          users: updatedUsers
        }
      };
      handleInputChange('fullModeration.actionWhitelists', updatedActionWhitelists);
    }
  };

  const handleRemoveActionUserWhitelist = (actionKey, userId) => {
    if (!settings || !actionKey) return;
    const currentWhitelists = settings.fullModeration?.actionWhitelists || {};
    const actionData = currentWhitelists[actionKey] || { users: [], roles: [] };
    const currentUsers = actionData.users || [];
    const updatedUsers = currentUsers.filter(u => (typeof u === 'string' ? u !== userId : u.userId !== userId));

    const updatedActionWhitelists = {
      ...currentWhitelists,
      [actionKey]: {
        ...actionData,
        users: updatedUsers
      }
    };
    handleInputChange('fullModeration.actionWhitelists', updatedActionWhitelists);
  };

  const handleToggleActionRoleWhitelist = (actionKey, roleId) => {
    if (!settings || !actionKey) return;
    const currentWhitelists = settings.fullModeration?.actionWhitelists || {};
    const actionData = currentWhitelists[actionKey] || { users: [], roles: [] };
    const currentRoles = actionData.roles || [];

    let updatedRoles;
    if (currentRoles.includes(roleId)) {
      updatedRoles = currentRoles.filter(r => r !== roleId);
    } else {
      updatedRoles = [...currentRoles, roleId];
    }

    const updatedActionWhitelists = {
      ...currentWhitelists,
      [actionKey]: {
        ...actionData,
        roles: updatedRoles
      }
    };
    handleInputChange('fullModeration.actionWhitelists', updatedActionWhitelists);
  };

  const handleManualAddActionUserWhitelist = async (actionKey) => {
    if (!actionKey) return;
    const query = actionWhitelistSearchQuery.trim();
    if (!query) return;

    const isId = /^\d{17,20}$/.test(query);
    if (isId) {
      let details = null;
      try {
        details = await api.getAdminMemberDetails(guildId, query);
        if (details) {
          setAllMembers(prev => {
            if (!prev.some(m => m.id === query)) {
              return [...prev, details];
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn(`[Dashboard] Member details not found for ID ${query}:`, err);
      }
      handleAddActionUserWhitelist(actionKey, query, details);
      setActionWhitelistSearchQuery('');
      setActionWhitelistSearchedMembers([]);
    } else {
      if (actionWhitelistSearchedMembers.length > 0) {
        const firstMatch = actionWhitelistSearchedMembers.find(m => {
          const users = settings.fullModeration?.actionWhitelists?.[actionKey]?.users || [];
          return !users.some(u => (typeof u === 'string' ? u === m.id : u.userId === m.id));
        });
        if (firstMatch) {
          handleAddActionUserWhitelist(actionKey, firstMatch.id, firstMatch);
          setActionWhitelistSearchQuery('');
          setActionWhitelistSearchedMembers([]);
        }
      } else {
        alert('Please enter a valid Discord User ID (17-20 digits) or search/select a member.');
      }
    }
  };

  const handleAddTempVoiceUserWhitelist = (userId, details = null) => {
    if (!settings) return;
    const currentUsers = settings.tempVoice?.whitelistedUsers || [];
    if (!currentUsers.some(u => (typeof u === 'string' ? u === userId : u.userId === userId))) {
      const addedBy = user ? user.username : 'Dashboard';
      const username = details ? details.username : '';
      const displayName = details ? details.displayName : '';
      const avatar = details ? details.avatar : '';
      const updatedUsers = [...currentUsers, { userId, addedBy, username, displayName, avatar, addedAt: new Date() }];
      handleInputChange('tempVoice.whitelistedUsers', updatedUsers);
    }
  };

  const handleRemoveTempVoiceUserWhitelist = (userId) => {
    if (!settings) return;
    const currentUsers = settings.tempVoice?.whitelistedUsers || [];
    const updatedUsers = currentUsers.filter(u => (typeof u === 'string' ? u !== userId : u.userId !== userId));
    handleInputChange('tempVoice.whitelistedUsers', updatedUsers);
  };

  const handleManualAddTempVoiceUserWhitelist = async () => {
    const query = tempVoiceSearchQuery.trim();
    if (!query) return;

    const isId = /^\d{17,20}$/.test(query);
    if (isId) {
      let details = null;
      try {
        details = await api.getAdminMemberDetails(guildId, query);
        if (details) {
          setAllMembers(prev => {
            if (!prev.some(m => m.id === query)) return [...prev, details];
            return prev;
          });
        }
      } catch (err) {
        console.warn(`[Dashboard] Member details not found for ID ${query}:`, err);
      }
      handleAddTempVoiceUserWhitelist(query, details);
      setTempVoiceSearchQuery('');
      setTempVoiceSearchedMembers([]);
    } else {
      if (tempVoiceSearchedMembers.length > 0) {
        const firstMatch = tempVoiceSearchedMembers.find(m => !(settings.tempVoice?.whitelistedUsers || []).some(u => (typeof u === 'string' ? u === m.id : u.userId === m.id)));
        if (firstMatch) {
          handleAddTempVoiceUserWhitelist(firstMatch.id, firstMatch);
          setTempVoiceSearchQuery('');
          setTempVoiceSearchedMembers([]);
        }
      } else {
        alert('Please enter a valid Discord User ID (17-20 digits) or search/select a member.');
      }
    }
  };

  const handleToggleTempVoiceRoleWhitelist = (roleId) => {
    if (!settings) return;
    const currentRoles = settings.tempVoice?.whitelistedRoles || [];
    let updatedRoles;
    const exists = currentRoles.some(r => (typeof r === 'string' ? r === roleId : (r.roleId === roleId || r.id === roleId)));
    if (exists) {
      updatedRoles = currentRoles.filter(r => (typeof r === 'string' ? r !== roleId : (r.roleId !== roleId && r.id !== roleId)));
    } else {
      const roleObj = roles.find(r => r.id === roleId);
      updatedRoles = [
        ...currentRoles,
        roleObj ? { roleId: roleObj.id, name: roleObj.name, color: roleObj.color ? `#${roleObj.color.toString(16).padStart(6, '0')}` : '' } : roleId
      ];
    }
    handleInputChange('tempVoice.whitelistedRoles', updatedRoles);
  };

  const handleManualAddWhitelist = async () => {
    const query = memberSearchQuery.trim();
    if (!query) return;

    const isId = /^\d{17,20}$/.test(query);
    if (isId) {
      let details = null;
      try {
        details = await api.getAdminMemberDetails(guildId, query);
        if (details) {
          setAllMembers(prev => {
            if (!prev.some(m => m.id === query)) {
              return [...prev, details];
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn(`[Dashboard] Member details not found for ID ${query}:`, err);
      }
      handleAddWhitelist(query, selectedWhitelistEvents, details);
      setMemberSearchQuery('');
      setSelectedWhitelistEvents([]);
      setSearchedMembers([]);
    } else {
      if (searchedMembers.length > 0) {
        const firstMatch = searchedMembers.find(m => !(settings.antinuke.whitelistedUsers || []).some(u => u.userId === m.id));
        if (firstMatch) {
          handleAddWhitelist(firstMatch.id, selectedWhitelistEvents, firstMatch);
          setMemberSearchQuery('');
          setSelectedWhitelistEvents([]);
          setSearchedMembers([]);
        }
      } else {
        alert('Please enter a valid Discord User ID (17-20 digits) or search/select a member.');
      }
    }
  };

  const getFeatureSettings = (s, tab) => {
    if (!s) return null;
    switch (tab) {
      case 'fullmoderation':
        return s.fullModeration;
      case 'antinuke':
        return s.antinuke;
      case 'moderation':
        return s.moderation;
      case 'welcome':
        return s.welcome;
      case 'verification':
        return s.verification;
      case 'tickets':
        return s.tickets;
      case 'roles':
        return { autoRole: s.autoRole, autoNickname: s.autoNickname };
      case 'youtube':
        return s.youtube;
      case 'tempvoice':
        return s.tempVoice;
      default:
        return null;
    }
  };

  const isSettingsEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) {
      return a == b;
    }
    if (typeof a !== 'object' || typeof b !== 'object') {
      if (typeof a === 'number' || typeof b === 'number') {
        return Number(a) === Number(b);
      }
      if (typeof a === 'boolean' || typeof b === 'boolean') {
        return Boolean(a) === Boolean(b);
      }
      return a === b;
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isSettingsEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a).filter(k => k !== '_id' && k !== '__v' && a[k] !== undefined && a[k] !== null);
    const keysB = Object.keys(b).filter(k => k !== '_id' && k !== '__v' && b[k] !== undefined && b[k] !== null);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isSettingsEqual(a[key], b[key])) return false;
    }
    return true;
  };

  const hasUnsavedChanges = (tab = activeTab) => {
    if (tab === 'server-control') {
      return adminHasUnsavedChanges;
    }
    if (!settings || !savedSettings) return false;
    const current = getFeatureSettings(settings, tab);
    const saved = getFeatureSettings(savedSettings, tab);
    if (!current || !saved) return false;
    return !isSettingsEqual(current, saved);
  };

  const handleTabClick = (newTab) => {
    if (hasUnsavedChanges()) {
      alert("You have unsaved changes. Please save or reset before leaving this feature.");
      return;
    }
    if (newTab === 'server-control' && !canAccessServerSettings) {
      alert("Access Denied: Server Settings are locked under Full Moderation. You must be explicitly whitelisted to access Server Settings.");
      return;
    }
    setActiveTab(newTab);
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges()) {
      alert("You have unsaved changes. Please save or reset before leaving this feature.");
      return;
    }
    onBack();
  };

  const handleReset = () => {
    if (savedSettings) {
      setSettings(JSON.parse(JSON.stringify(savedSettings)));
      showNotification('Changes reset to previously saved values.');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Please save or reset before leaving this feature.";
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [settings, savedSettings, activeTab, adminHasUnsavedChanges]);

  const resolveUploadUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      const isLocal = window.location.port === '5173' || window.location.port === '5174';
      return isLocal ? `http://localhost:2010${url}` : url;
    }
    const giphyMatch = url.match(/giphy\.com\/gifs\/(?:.*-)?([a-zA-Z0-9]+)$/i);
    if (giphyMatch && giphyMatch[1]) {
      return `https://i.giphy.com/media/${giphyMatch[1]}/giphy.gif`;
    }
    const imgurMatch = url.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/i);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.gif`;
    }
    return url;
  };

  const getOrdinal = (n) => {
    const num = parseInt(n, 10);
    if (isNaN(num)) return `${n}th`;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatWelcomeText = (rawText) => {
    if (!rawText) return '';

    const count = memberCount || 11;
    const ordinal = getOrdinal(count);

    const redirectCh = channels.find(c => c.id === settings?.welcome?.redirectChannelId);
    const channelName = redirectCh ? redirectCh.name : 'channel';
    const redirectCh2 = channels.find(c => c.id === settings?.welcome?.redirectChannelId2);
    const channelName2 = redirectCh2 ? redirectCh2.name : 'channel';
    const redirectCh3 = channels.find(c => c.id === settings?.welcome?.redirectChannelId3);
    const channelName3 = redirectCh3 ? redirectCh3.name : 'channel';

    let text = rawText
      .replace(/{username}/g, user?.username || 'Member')
      .replace(/{server}/g, guildName || 'Server')
      .replace(/{member_ordinal}/gi, ordinal)
      .replace(/{memberordinal}/gi, ordinal)
      .replace(/{ordinal}/gi, ordinal)
      .replace(/{member_count}/gi, String(count))
      .replace(/{membercount}/gi, String(count))
      .replace(/{count}/gi, String(count))
      .replace(/{member_number}/gi, `#${count}`)
      .replace(/{membernumber}/gi, `#${count}`);

    const parts = text.split(/({user}|{channel}|{channel2}|{channel3})/g);

    return parts.map((part, index) => {
      if (part === '{user}') {
        return (
          <span key={`mention-user-${index}`} className="discord-mention">
            @{user?.username || 'Member'}
          </span>
        );
      }
      if (part === '{channel}') {
        return (
          <span key={`mention-ch-${index}`} className="discord-mention-channel">
            #{channelName}
          </span>
        );
      }
      if (part === '{channel2}') {
        return (
          <span key={`mention-ch2-${index}`} className="discord-mention-channel">
            #{channelName2}
          </span>
        );
      }
      if (part === '{channel3}') {
        return (
          <span key={`mention-ch3-${index}`} className="discord-mention-channel">
            #{channelName3}
          </span>
        );
      }

      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return (
            <strong key={`bold-${index}-${subIndex}`} style={{ color: '#ffffff', fontWeight: '600' }}>
              {subPart.slice(2, -2)}
            </strong>
          );
        }
        return subPart;
      });
    });
  };

  const renderRedirectButton = () => {
    const redirectIds = [
      settings?.welcome?.redirectChannelId,
      settings?.welcome?.redirectChannelId2,
      settings?.welcome?.redirectChannelId3
    ].filter(Boolean);

    if (redirectIds.length === 0) return null;

    return (
      <div className="discord-buttons-row">
        {redirectIds.map((id, index) => {
          const redirectCh = channels.find(c => c.id === id);
          const channelName = redirectCh ? redirectCh.name : 'channel';
          return (
            <span key={id + index} className="discord-button-link">
              <span>#{channelName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </span>
          );
        })}
      </div>
    );
  };

  const renderCanvasCard = () => {
    if (!settings || !settings.welcome) return null;
    const cardCount = memberCount || 11;
    const cardOrdinal = getOrdinal(cardCount);
    return (
      <div className="glass-panel" style={{
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        containerType: 'inline-size',
        background: settings.welcome.background ? (
          (settings.welcome.background.startsWith('#') || settings.welcome.background.length === 6 || settings.welcome.background.length === 3)
            ? (settings.welcome.background.startsWith('#') ? settings.welcome.background : `#${settings.welcome.background}`)
            : `url(${resolveUploadUrl(settings.welcome.background)}) center/cover no-repeat`
        ) : 'linear-gradient(135deg, #0F0C20 0%, #151030 50%, #060410 100%)',
        border: (settings.welcome.cardBorderEnabled && settings.welcome.cardBorderThickness > 0)
          ? `${(settings.welcome.cardBorderThickness || 8) / 8}cqw solid ${settings.welcome.cardBorderColor || '#00ff66'}`
          : '1px solid rgba(255,255,255,0.05)',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}>
        {/* Overlay Tint layer */}
        {((settings.welcome.overlayOpacity !== undefined ? settings.welcome.overlayOpacity : 0.3) > 0) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: settings.welcome.overlayColor || '#000000',
            opacity: settings.welcome.overlayOpacity !== undefined ? settings.welcome.overlayOpacity : 0.3,
            zIndex: 1,
            pointerEvents: 'none'
          }} />
        )}

        {/* Drag items container query representation */}
        {/* Avatar element wrapper */}
        {settings.welcome.avatarEnabled !== false && (
          <div
            onMouseDown={(e) => handleDragStart(e, 'avatar')}
            onTouchStart={(e) => handleDragStart(e, 'avatar')}
            style={{
              position: 'absolute',
              left: `${((settings.welcome.avatarX !== undefined ? settings.welcome.avatarX : 400) / 800) * 100}%`,
              top: `${((settings.welcome.avatarY !== undefined ? settings.welcome.avatarY : 130) / 450) * 100}%`,
              width: `${((settings.welcome.avatarSize || 140) / 800) * 100}%`,
              aspectRatio: '1/1',
              transform: `translate(-50%, -50%) rotate(${settings.welcome.avatarRotation || 0}deg)`,
              cursor: 'move',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
              alt="avatar preview"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `${(settings.welcome.avatarBorderThickness !== undefined ? settings.welcome.avatarBorderThickness : 6) / 8}cqw solid ${settings.welcome.avatarBorderColor || settings.welcome.textColor || '#ffffff'}`,
                boxShadow: settings.welcome.avatarShadowEnabled
                  ? `0 0 ${(settings.welcome.avatarShadowBlur || 15) / 8}cqw ${settings.welcome.avatarShadowColor || '#00ff66'}`
                  : '0 4px 10px rgba(0,0,0,0.4)',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}

        {/* Title element wrapper */}
        {settings.welcome.titleEnabled !== false && (
          <div
            onMouseDown={(e) => handleDragStart(e, 'title')}
            onTouchStart={(e) => handleDragStart(e, 'title')}
            style={{
              position: 'absolute',
              left: `${((settings.welcome.titleX !== undefined ? settings.welcome.titleX : 400) / 800) * 100}%`,
              top: `${((settings.welcome.titleY !== undefined ? settings.welcome.titleY : 260) / 450) * 100}%`,
              transform: settings.welcome.textAlignment === 'left' ? 'translate(-100%, -50%)' : (settings.welcome.textAlignment === 'right' ? 'translate(0%, -50%)' : 'translate(-50%, -50%)'),
              cursor: 'move',
              zIndex: 9,
              textAlign: settings.welcome.textAlignment === 'left' ? 'right' : (settings.welcome.textAlignment === 'right' ? 'left' : 'center'),
              whiteSpace: 'nowrap'
            }}
          >
            <h2 style={{
              fontSize: `${(settings.welcome.titleSize || 54) / 8}cqw`,
              color: settings.welcome.textColor || '#ffffff',
              fontFamily: settings.welcome.titleFontFamily || settings.welcome.fontFamily || 'Ethnocentric, sans-serif',
              fontWeight: settings.welcome.fontWeight || 'bold',
              fontStyle: settings.welcome.titleFontStyle || 'normal',
              letterSpacing: '2px',
              textShadow: settings.welcome.titleGlowEnabled
                ? `0 0 ${(settings.welcome.titleGlowBlur || 10) / 8}cqw ${settings.welcome.titleGlowColor || '#00ff66'}, 0 0 ${(settings.welcome.titleGlowBlur || 10) / 4}cqw ${settings.welcome.titleGlowColor || '#00ff66'}`
                : (settings.welcome.textShadowEnabled
                  ? `0 1px ${(settings.welcome.textShadowBlur || 5) / 8}cqw ${settings.welcome.textShadowColor || '#000000'}`
                  : '0 2px 6px rgba(0,0,0,0.6)'),
              margin: 0,
              pointerEvents: 'none'
            }}>
              {(settings.welcome.titleText || 'WELCOME')
                .replace(/{server}/g, guildName)
                .replace(/{username}/g, (user.username || 'Member').toUpperCase())
                .replace(/{member_ordinal}/gi, cardOrdinal)
                .replace(/{memberordinal}/gi, cardOrdinal)
                .replace(/{ordinal}/gi, cardOrdinal)
                .replace(/{member_count}/gi, String(cardCount))
                .replace(/{membercount}/gi, String(cardCount))
                .replace(/{count}/gi, String(cardCount))
                .replace(/{member_number}/gi, `#${cardCount}`)
                .replace(/{membernumber}/gi, `#${cardCount}`)}
            </h2>
          </div>
        )}

        {/* Username element wrapper */}
        {settings.welcome.usernameEnabled !== false && (
          <div
            onMouseDown={(e) => handleDragStart(e, 'username')}
            onTouchStart={(e) => handleDragStart(e, 'username')}
            style={{
              position: 'absolute',
              left: `${((settings.welcome.usernameX !== undefined ? settings.welcome.usernameX : 400) / 800) * 100}%`,
              top: `${((settings.welcome.usernameY !== undefined ? settings.welcome.usernameY : 320) / 450) * 100}%`,
              transform: settings.welcome.textAlignment === 'left' ? 'translate(-100%, -50%)' : (settings.welcome.textAlignment === 'right' ? 'translate(0%, -50%)' : 'translate(-50%, -50%)'),
              cursor: 'move',
              zIndex: 9,
              textAlign: settings.welcome.textAlignment === 'left' ? 'right' : (settings.welcome.textAlignment === 'right' ? 'left' : 'center'),
              whiteSpace: 'nowrap'
            }}
          >
            <h3 style={{
              fontSize: `${(settings.welcome.usernameSize || 38) / 8}cqw`,
              color: settings.welcome.usernameColor || '#ffffff',
              fontFamily: settings.welcome.usernameFontFamily || settings.welcome.fontFamily || 'Ethnocentric, sans-serif',
              fontWeight: settings.welcome.fontWeight || 'bold',
              fontStyle: settings.welcome.usernameFontStyle || 'normal',
              textShadow: settings.welcome.usernameGlowEnabled
                ? `0 0 ${(settings.welcome.usernameGlowBlur || 10) / 8}cqw ${settings.welcome.usernameGlowColor || '#00ff66'}, 0 0 ${(settings.welcome.usernameGlowBlur || 10) / 4}cqw ${settings.welcome.usernameGlowColor || '#00ff66'}`
                : (settings.welcome.textShadowEnabled
                  ? `0 1px ${(settings.welcome.textShadowBlur || 5) / 8}cqw ${settings.welcome.textShadowColor || '#000000'}`
                  : '0 2px 6px rgba(0,0,0,0.6)'),
              margin: 0,
              pointerEvents: 'none'
            }}>
              {'@' + user.username.toUpperCase()}
            </h3>
          </div>
        )}

        {/* Subtext element wrapper */}
        {settings.welcome.subtextEnabled !== false && (
          <div
            onMouseDown={(e) => handleDragStart(e, 'subtext')}
            onTouchStart={(e) => handleDragStart(e, 'subtext')}
            style={{
              position: 'absolute',
              left: `${((settings.welcome.subtextX !== undefined ? settings.welcome.subtextX : 400) / 800) * 100}%`,
              top: `${((settings.welcome.subtextY !== undefined ? settings.welcome.subtextY : 370) / 450) * 100}%`,
              transform: settings.welcome.textAlignment === 'left' ? 'translate(-100%, -50%)' : (settings.welcome.textAlignment === 'right' ? 'translate(0%, -50%)' : 'translate(-50%, -50%)'),
              cursor: 'move',
              zIndex: 9,
              textAlign: settings.welcome.textAlignment === 'left' ? 'right' : (settings.welcome.textAlignment === 'right' ? 'left' : 'center'),
              whiteSpace: 'nowrap'
            }}
          >
            <p style={{
              fontSize: `${(settings.welcome.subtextSize || 22) / 8}cqw`,
              color: settings.welcome.subtextColor || 'rgba(255,255,255,0.8)',
              fontFamily: settings.welcome.subtextFontFamily || settings.welcome.fontFamily || 'Ethnocentric, sans-serif',
              fontWeight: settings.welcome.fontWeight || 'bold',
              fontStyle: settings.welcome.subtextFontStyle || 'normal',
              textShadow: settings.welcome.subtextGlowEnabled
                ? `0 0 ${(settings.welcome.subtextGlowBlur || 10) / 8}cqw ${settings.welcome.subtextGlowColor || '#00ff66'}, 0 0 ${(settings.welcome.subtextGlowBlur || 10) / 4}cqw ${settings.welcome.subtextGlowColor || '#00ff66'}`
                : (settings.welcome.textShadowEnabled
                  ? `0 1px ${(settings.welcome.textShadowBlur || 5) / 8}cqw ${settings.welcome.textShadowColor || '#000000'}`
                  : '0 1px 4px rgba(0,0,0,0.6)'),
              margin: 0,
              pointerEvents: 'none'
            }}>
              {(settings.welcome.subtextText || 'TO {server}')
                .replace(/{server}/g, guildName)
                .replace(/{username}/g, (user.username || 'Member').toUpperCase())
                .replace(/{member_ordinal}/gi, cardOrdinal)
                .replace(/{memberordinal}/gi, cardOrdinal)
                .replace(/{ordinal}/gi, cardOrdinal)
                .replace(/{member_count}/gi, String(cardCount))
                .replace(/{membercount}/gi, String(cardCount))
                .replace(/{count}/gi, String(cardCount))
                .replace(/{member_number}/gi, `#${cardCount}`)
                .replace(/{membernumber}/gi, `#${cardCount}`)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleResetLayout = () => {
    setSettings(prev => ({
      ...prev,
      welcome: {
        ...prev.welcome,
        avatarSize: 140,
        avatarX: 400,
        avatarY: 130,
        avatarRotation: 0,
        avatarBorderThickness: 6,
        avatarBorderColor: '#00ff66',
        usernameX: 400,
        usernameY: 320,
        usernameSize: 38,
        titleX: 400,
        titleY: 260,
        titleSize: 54,
        subtextX: 400,
        subtextY: 370,
        subtextSize: 22,
        textAlignment: 'center',
        fontWeight: 'bold',
        avatarEnabled: true,
        titleEnabled: true,
        usernameEnabled: true,
        subtextEnabled: true,
        layoutType: 'classic',
        titleText: 'WELCOME',
        subtextText: 'TO {server}',
        textColor: '#ffffff',
        usernameColor: '#ffffff',
        subtextColor: '#00ff66',
        fontFamily: 'Ethnocentric',
        titleFontFamily: 'Ethnocentric',
        usernameFontFamily: 'Ethnocentric',
        subtextFontFamily: 'Ethnocentric',
        textShadowEnabled: false,
        textShadowColor: '#000000',
        textShadowBlur: 5,
        titleGlowEnabled: false,
        titleGlowColor: '#00ff66',
        titleGlowBlur: 15,
        usernameGlowEnabled: false,
        usernameGlowColor: '#00ff66',
        usernameGlowBlur: 15,
        subtextGlowEnabled: false,
        subtextGlowColor: '#00ff66',
        subtextGlowBlur: 15,
        avatarShadowEnabled: false,
        avatarShadowColor: '#00ff66',
        avatarShadowBlur: 15,
        overlayOpacity: 0.3,
        overlayColor: '#000000',
        cardBorderEnabled: false,
        cardBorderColor: '#2563eb',
        cardBorderThickness: 8
      }
    }));
    showNotification('Layout reset to default positions, sizes & visibility!');
  };

  const getSanitizedSettings = (rawSettings) => {
    const s = JSON.parse(JSON.stringify(rawSettings));
    if (s.moderation) {
      if (s.moderation.photoSpam) {
        const ps = s.moderation.photoSpam;
        if (ps.maxPhotos === '' || ps.maxPhotos === null || ps.maxPhotos === undefined || isNaN(ps.maxPhotos)) {
          ps.maxPhotos = 3;
        }
        if (ps.timeWindow === '' || ps.timeWindow === null || ps.timeWindow === undefined || isNaN(ps.timeWindow)) {
          ps.timeWindow = 10000;
        }
        if (ps.timeoutDuration === '' || ps.timeoutDuration === null || ps.timeoutDuration === undefined || isNaN(ps.timeoutDuration)) {
          ps.timeoutDuration = 10;
        }
      }
      if (s.moderation.spam) {
        const spam = s.moderation.spam;
        if (spam.maxMessages === '' || spam.maxMessages === null || spam.maxMessages === undefined || isNaN(spam.maxMessages)) {
          spam.maxMessages = 5;
        }
        if (spam.timeWindow === '' || spam.timeWindow === null || spam.timeWindow === undefined || isNaN(spam.timeWindow)) {
          spam.timeWindow = 5000;
        }
        if (spam.timeoutDuration === '' || spam.timeoutDuration === null || spam.timeoutDuration === undefined || isNaN(spam.timeoutDuration)) {
          spam.timeoutDuration = 5;
        }
      }
    }
    if (s.antinuke) {
      const an = s.antinuke;
      if (an.threshold === '' || an.threshold === null || an.threshold === undefined || isNaN(an.threshold)) {
        an.threshold = 3;
      } else {
        an.threshold = parseInt(an.threshold);
      }
      if (an.timeframe === '' || an.timeframe === null || an.timeframe === undefined || isNaN(an.timeframe)) {
        an.timeframe = 60;
      } else {
        an.timeframe = parseInt(an.timeframe);
      }
    }

    if (s.tempVoice) {
      if (s.tempVoice.channelId) {
        s.tempVoice.channelId = String(s.tempVoice.channelId).trim();
      }
      if (s.tempVoice.categoryId) {
        s.tempVoice.categoryId = String(s.tempVoice.categoryId).trim();
      }
      if (Array.isArray(s.tempVoice.channels)) {
        s.tempVoice.channels = s.tempVoice.channels.map(ch => ({
          ...ch,
          channelId: String(ch?.channelId || '').trim(),
          categoryId: String(ch?.categoryId || '').trim()
        }));
      }
    }

    return s;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const sanitized = getSanitizedSettings(settings);
      const updated = await api.saveSettings(guildId, sanitized);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      showNotification('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save settings. Please verify details.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all audit logs for this server? This action cannot be undone.')) return;
    setClearingLogs(true);
    try {
      await api.clearLogs(guildId);
      setLogs([]);
      showNotification('Audit logs cleared successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to clear audit logs: ' + err.message);
    } finally {
      setClearingLogs(false);
    }
  };

  const handleApplyChannelToAllLogs = (channelId) => {
    if (!channelId) {
      setErrorMsg('Please select a valid text channel first.');
      return;
    }
    handleInputChange('logging.logChannelId', channelId);
    handleInputChange('antinuke.logChannelId', channelId);
    handleInputChange('moderation.wordFilter.logChannelId', channelId);
    showNotification('Assigned text channel to ALL server log modules!');
  };

  const handleExportLogs = () => {
    if (!logs || logs.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sidcord_audit_logs_${guildId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLogActionInfo = (type) => {
    const action = (type || '').toLowerCase();
    switch (action) {
      case 'ban':
        return { label: 'BANNED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', icon: '🔨' };
      case 'unban':
        return { label: 'UNBANNED', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', icon: '🔓' };
      case 'kick':
        return { label: 'KICKED', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', icon: '👢' };
      case 'timeout':
        return { label: 'TIMED OUT', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', icon: '🔇' };
      case 'untimeout':
        return { label: 'UNMUTED', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🔊' };
      case 'voice_join':
        return { label: 'JOINED VC', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: '🎤' };
      case 'voice_disconnect':
        return { label: 'LEFT VC', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', icon: '🚪' };
      case 'voice_move':
        return { label: 'MOVED VC', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', icon: '🔀' };
      case 'voice_mute':
        return { label: 'VOICE MUTED', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: '🎙️' };
      case 'voice_deafen':
        return { label: 'VOICE DEAFENED', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', icon: '🎧' };
      case 'role_add':
        return { label: 'ROLE ADDED', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', icon: '🏷️' };
      case 'role_remove':
        return { label: 'ROLE REMOVED', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', icon: '🏷️' };
      case 'role_update':
        return { label: 'ROLES UPDATED', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', icon: '🏷️' };
      case 'channel_create':
        return { label: 'CHANNEL CREATED', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '📁' };
      case 'channel_delete':
        return { label: 'CHANNEL DELETED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', icon: '📁' };
      case 'channel_update':
        return { label: 'CHANNEL UPDATED', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)', icon: '📁' };
      case 'role_create':
        return { label: 'ROLE CREATED', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🎭' };
      case 'role_delete':
        return { label: 'ROLE DELETED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', icon: '🎭' };
      case 'message_delete':
        return { label: 'MESSAGE DELETED', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', icon: '🗑️' };
      case 'member_join':
        return { label: 'MEMBER JOINED', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', icon: '📥' };
      case 'member_leave':
        return { label: 'MEMBER LEFT', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', icon: '📤' };
      default:
        return { label: (type || 'ACTION').toUpperCase(), color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: '🛡️' };
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        handleSave(e);
      } else {
        if (e.target.tagName.toLowerCase() !== 'textarea') {
          e.preventDefault();
        }
      }
    }
  };

  const handlePublishVerification = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // First save settings
      const sanitized = getSanitizedSettings(settings);
      const updated = await api.saveSettings(guildId, sanitized);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      // Publish
      const res = await api.publishVerification(guildId);
      showNotification(res.message || 'Verification message published!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to publish verification message.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishTickets = async (panelId = null) => {
    setPublishingTickets(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // First save settings
      const sanitized = getSanitizedSettings(settings);
      const updated = await api.saveSettings(guildId, sanitized);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      // Publish
      const res = await api.publishTickets(guildId, panelId);
      showNotification(res.message || 'Ticket system panel embed published successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to publish ticket system message.');
    } finally {
      setPublishingTickets(false);
    }
  };

  const [publishingSelfRoles, setPublishingSelfRoles] = useState(false);
  const handlePublishSelfRoles = async (panelId = null) => {
    setPublishingSelfRoles(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // First save settings
      const sanitized = getSanitizedSettings(settings);
      const updated = await api.saveSettings(guildId, sanitized);
      setSettings(updated);
      setSavedSettings(JSON.parse(JSON.stringify(updated)));
      // Publish to Discord
      const res = await api.publishSelfRoles(guildId, panelId);
      showNotification(res.message || 'Self roles panel published to Discord successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to publish self roles panel.');
    } finally {
      setPublishingSelfRoles(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Syncing settings database...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', borderColor: 'var(--danger)' }}>
          <AlertTriangle size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Failed to Load Settings</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Could not retrieve settings for this server. Please check if the bot is online and running.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={onBack} className="btn-secondary">Back to Servers</button>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }
  const getAvatarUrl = () => {
    if (!user) return 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (user.avatar) {
      const id = user.discordId || user.id;
      return `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png`;
    }
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  };

  return (
    <div className="dashboard-root-layout">
      {/* Top Navbar Header */}
      <header className="dashboard-top-navbar">
        <div className="dashboard-nav-left">
          <button onClick={handleBackClick} className="btn-nav-servers">
            <Home size={15} />
            Servers
          </button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff', marginLeft: '8px' }}>
            {guildName.toUpperCase()}
          </h3>
        </div>

        <div className="dashboard-nav-right">
          <img
            src={getAvatarUrl()}
            alt={user?.username || 'User'}
            className="dashboard-user-avatar"
          />
          {onLogout && (
            <button onClick={onLogout} className="btn-nav-logout" title="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="dashboard-main-viewport">
        {/* Left Sidebar */}
        <aside className="dashboard-left-sidebar">
          <div className="sidebar-category-title">Configuration Panel</div>
          <div className="sidebar-menu-links">
            <button
              type="button"
              onClick={() => handleTabClick('overview')}
              className={`sidebar-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <Home size={16} />
              Overview
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('moderation')}
              className={`sidebar-menu-item ${activeTab === 'moderation' ? 'active' : ''}`}
            >
              <Shield size={16} />
              Moderation
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('fullmoderation')}
              className={`sidebar-menu-item ${activeTab === 'fullmoderation' ? 'active' : ''}`}
            >
              <Lock size={16} />
              Full Moderation
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.65rem',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                NEW
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('antinuke')}
              className={`sidebar-menu-item ${activeTab === 'antinuke' ? 'active' : ''}`}
            >
              <ShieldAlert size={16} />
              Anti-nuke Shield
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('welcome')}
              className={`sidebar-menu-item ${activeTab === 'welcome' ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              Welcome
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('verification')}
              className={`sidebar-menu-item ${activeTab === 'verification' ? 'active' : ''}`}
            >
              <UserCheck size={16} />
              Verification Role
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('tickets')}
              className={`sidebar-menu-item ${activeTab === 'tickets' ? 'active' : ''}`}
            >
              <Ticket size={16} />
              Ticket Panels
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('selfroles')}
              className={`sidebar-menu-item ${activeTab === 'selfroles' ? 'active' : ''}`}
            >
              <Award size={16} />
              Self Roles
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.65rem',
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                V2
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('logs')}
              className={`sidebar-menu-item ${activeTab === 'logs' ? 'active' : ''}`}
            >
              <FileText size={16} />
              Server Logs
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('broadcast')}
              className={`sidebar-menu-item ${activeTab === 'broadcast' ? 'active' : ''}`}
            >
              <Send size={16} />
              Broadcast DMs
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('publish')}
              className={`sidebar-menu-item ${activeTab === 'publish' ? 'active' : ''}`}
            >
              <Megaphone size={16} />
              Publish Embeds
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('youtube')}
              className={`sidebar-menu-item ${activeTab === 'youtube' ? 'active' : ''}`}
            >
              <Youtube size={16} />
              YouTube Feeds
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('tempvoice')}
              className={`sidebar-menu-item ${activeTab === 'tempvoice' ? 'active' : ''}`}
            >
              <Mic size={16} />
              Temp Voice
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('polls')}
              className={`sidebar-menu-item ${activeTab === 'polls' ? 'active' : ''}`}
            >
              <BarChart2 size={16} />
              Premium Polls
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('giveaways')}
              className={`sidebar-menu-item ${activeTab === 'giveaways' ? 'active' : ''}`}
            >
              <Gift size={16} />
              Giveaways
            </button>

            {canAccessServerSettings && (
              <>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
                <button
                  type="button"
                  onClick={() => handleTabClick('server-control')}
                  className={`sidebar-menu-item ${activeTab === 'server-control' ? 'active' : ''}`}
                  style={{ color: 'var(--primary)', fontWeight: 'bold' }}
                >
                  <Server size={16} />
                  Server Settings
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="dashboard-right-content">
          {/* Global Notifications */}
          {successMsg && (
            <div className="glass-panel pulse-glow" style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              borderColor: 'var(--success)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 100,
              fontFamily: 'Outfit',
              fontWeight: '600'
            }}>
              <CheckCircle size={18} />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="glass-panel" style={{
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderColor: 'var(--danger)',
              color: 'var(--danger)',
              padding: '14px 20px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={18} />
              {errorMsg}
            </div>
          )}

          {activeTab === 'server-control' ? (
            canAccessServerSettings ? (
              <AdminServerSettings
                guildId={guildId}
                onHasUnsavedChangesChange={setAdminHasUnsavedChanges}
              />
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  color: '#f87171'
                }}>
                  <Lock size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px' }}>
                  Server Settings Locked
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Under <strong>Full Moderation</strong>, Server Settings access is strictly locked. Administrators cannot view or open Server Settings unless they have been explicitly added to the Server Settings whitelist.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabClick('overview')}
                  className="btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  Return to Overview
                </button>
              </div>
            )
          ) : (
            <form onSubmit={handleSave} onKeyDown={handleFormKeyDown}>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>

                  <div className="overview-stats-container">
                    <div className="overview-stat-panel">
                      <span className="overview-stat-label">Members</span>
                      <h3 className="overview-stat-number">{memberCount || 66}</h3>
                    </div>
                    <div className="overview-stat-panel">
                      <span className="overview-stat-label">Text Channels</span>
                      <h3 className="overview-stat-number">{channels.length || 54}</h3>
                    </div>
                    <div className="overview-stat-panel">
                      <span className="overview-stat-label">Voice Channels</span>
                      <h3 className="overview-stat-number">{voiceChannels.length || 4}</h3>
                    </div>
                  </div>

                  <div className="checklist-card-box">
                    <h3 className="checklist-title-h3">Active Modules Checklist</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: 'Auto-Moderation', enabled: settings?.moderation?.spam?.enabled },
                        { label: 'Welcome Embeds & Roles', enabled: settings?.welcome?.enabled },
                        { label: 'Security Verification Button', enabled: settings?.verification?.enabled },
                        { label: 'Support Tickets System', enabled: settings?.tickets?.enabled },
                        { label: 'Temporary Voice Channels', enabled: settings?.tempVoice?.enabled },
                        { label: 'Server Action Auditing Logs', enabled: true },
                        { label: 'Anti-nuke Admin Shield', enabled: settings?.antinuke?.enabled }
                      ].map((module, idx) => (
                        <div key={idx} className="checklist-row-item">
                          <span className="checklist-row-label">{module.label}</span>
                          <span className={`badge-status-pill ${module.enabled ? 'enabled' : 'disabled'}`}>
                            {module.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overview Quick Config: Discord Audit Log Channel */}
                  <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', backgroundColor: 'rgba(37, 99, 235, 0.03)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
                          🛡️ Discord Server Audit Log Channel Dispatch
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Send all server audit logs (bans, kicks, mutes, voice activity, roles, channels, messages) as text & embeds to your Discord channel.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTabClick('logs')}
                        className="btn"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                      >
                        View Live Audit Logs →
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      <div>
                        <label className="form-label" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Hash size={16} /> Select Discord Audit Log Text Channel
                        </label>
                        <select
                          className="form-control"
                          value={settings?.logging?.logChannelId || ''}
                          onChange={(e) => handleInputChange('logging.logChannelId', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            outline: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          <option value="" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>-- No Channel Selected (Disabled) --</option>
                          {channels.map(ch => (
                            <option key={ch.id} value={ch.id} style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>#{ch.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleApplyChannelToAllLogs(settings?.logging?.logChannelId)}
                          disabled={!settings?.logging?.logChannelId}
                          style={{
                            marginTop: '8px',
                            padding: '8px 12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            cursor: settings?.logging?.logChannelId ? 'pointer' : 'not-allowed',
                            width: '100%'
                          }}
                        >
                          ⚡ Route ALL Server Logs & Audits to This Channel
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Audit Logger Master Switch</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Send live server audit logs to Discord chat</div>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={settings?.logging?.enabled !== false}
                            onChange={() => handleToggle('logging.enabled')}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MODERATION */}
              {activeTab === 'moderation' && (
                <div>

                  {/* Full Moderation Feature Quick Banner */}
                  <div className="glass-panel" style={{
                    padding: '16px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.05))',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f87171'
                      }}>
                        <Lock size={22} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Full Moderation System</h4>
                          <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>NEW</span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                          Even administrators with Administrator role cannot create or give roles unless explicitly whitelisted.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabClick('fullmoderation')}
                      className="btn-primary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Configure Full Moderation &rarr;
                    </button>
                  </div>

                  {/* MASTER FULL WHITELIST PANEL FOR MODERATION */}
                  <div className="glass-panel" style={{
                    padding: '24px',
                    marginBottom: '24px',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                    position: 'relative'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.15))',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#34d399',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                        }}>
                          <ShieldCheck size={26} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                              Moderation Full Whitelist
                            </h3>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              background: 'rgba(16, 185, 129, 0.18)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              letterSpacing: '0.5px'
                            }}>
                              MASTER IMMUNITY
                            </span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                            Trusted members, roles, or channels added here bypass ALL moderation filters (Spam messages, forbidden links, photo spam, and automod word filter).
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: (settings.moderation?.fullWhitelist?.enabled !== false) ? '#34d399' : 'var(--text-muted)'
                        }}>
                          {(settings.moderation?.fullWhitelist?.enabled !== false) ? 'Whitelist Active' : 'Whitelist Disabled'}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={settings.moderation?.fullWhitelist?.enabled !== false}
                            onChange={() => handleToggle('moderation.fullWhitelist.enabled')}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    {/* Subtab Navigation Pills */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '20px',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '14px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        type="button"
                        onClick={() => setModWhitelistActiveSubtab('users')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: modWhitelistActiveSubtab === 'users' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          color: modWhitelistActiveSubtab === 'users' ? '#34d399' : 'var(--text-secondary)',
                          border: modWhitelistActiveSubtab === 'users' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent'
                        }}
                      >
                        <UserCheck size={16} />
                        Whitelisted Members ({(settings.moderation?.whitelistedUsers || []).length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setModWhitelistActiveSubtab('roles')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: modWhitelistActiveSubtab === 'roles' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          color: modWhitelistActiveSubtab === 'roles' ? '#34d399' : 'var(--text-secondary)',
                          border: modWhitelistActiveSubtab === 'roles' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent'
                        }}
                      >
                        <Award size={16} />
                        Whitelisted Roles ({(settings.moderation?.whitelistedRoles || []).length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setModWhitelistActiveSubtab('channels')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: modWhitelistActiveSubtab === 'channels' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          color: modWhitelistActiveSubtab === 'channels' ? '#34d399' : 'var(--text-secondary)',
                          border: modWhitelistActiveSubtab === 'channels' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent'
                        }}
                      >
                        <Hash size={16} />
                        Whitelisted Channels ({(settings.moderation?.whitelistedChannels || []).length})
                      </button>
                    </div>

                    {/* Subtab 1: MEMBERS */}
                    {modWhitelistActiveSubtab === 'users' && (
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ position: 'relative', zIndex: 20, marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Search Member or Enter Discord User ID:
                          </label>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Type username or 17-20 digit user ID to whitelist..."
                                value={modWhitelistSearchQuery}
                                onChange={(e) => setModWhitelistSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleManualAddModWhitelist();
                                  }
                                }}
                                className="glass-input"
                                style={{ width: '100%', padding: '12px' }}
                              />
                              {modWhitelistSearchLoading && (
                                <div style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Searching...</div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={handleManualAddModWhitelist}
                              className="btn-primary"
                              style={{
                                padding: '0 24px',
                                height: '46px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                fontWeight: '600'
                              }}
                            >
                              Add to Whitelist
                            </button>
                          </div>

                          {/* Member Search Results Dropdown */}
                          {modWhitelistSearchedMembers.length > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: '100%',
                                background: 'rgba(25, 25, 35, 0.98)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                marginTop: '5px',
                                maxHeight: '220px',
                                overflowY: 'auto',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 1000
                              }}
                            >
                              {modWhitelistSearchedMembers
                                .filter(m => !(settings.moderation?.whitelistedUsers || []).some(u => (typeof u === 'string' ? u : u.userId) === m.id))
                                .map(m => (
                                  <div
                                    key={m.id}
                                    onClick={() => { handleAddModWhitelist(m.id, m); setModWhitelistSearchQuery(''); }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '10px 14px',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                    className="search-item"
                                  >
                                    <img
                                      src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                      alt=""
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{m.displayName}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{m.username} • {m.id}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Whitelisted Users Display List */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>
                              Whitelisted Members ({(settings.moderation?.whitelistedUsers || []).length}):
                            </h4>
                            {(settings.moderation?.whitelistedUsers || []).length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to remove all whitelisted members?')) {
                                    handleInputChange('moderation.whitelistedUsers', []);
                                  }
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem',
                                  fontWeight: '600'
                                }}
                              >
                                Clear All Members
                              </button>
                            )}
                          </div>

                          {(settings.moderation?.whitelistedUsers || []).length === 0 ? (
                            <div style={{
                              padding: '24px',
                              textAlign: 'center',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px dashed rgba(255,255,255,0.1)'
                            }}>
                              <UserCheck size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px', opacity: 0.6 }} />
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                No whitelisted members yet. Only the Server Owner bypasses moderation by default. Add trusted staff or members above.
                              </p>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '10px' }}>
                              {(settings.moderation.whitelistedUsers || []).map(entry => {
                                const entryId = typeof entry === 'string' ? entry : entry.userId;
                                const details = getMemberDetails(entryId);
                                const displayName = details.displayName || (typeof entry === 'object' ? entry.displayName : '') || entryId;
                                const username = details.username || (typeof entry === 'object' ? entry.username : '');
                                const avatar = details.avatar || (typeof entry === 'object' ? entry.avatar : '');
                                const addedBy = (typeof entry === 'object' && entry.addedBy) ? entry.addedBy : 'Admin';

                                return (
                                  <div
                                    key={entryId}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '12px 14px',
                                      borderRadius: '10px',
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid rgba(255,255,255,0.07)',
                                      gap: '10px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, overflow: 'hidden' }}>
                                      <img
                                        src={avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                        alt=""
                                      />
                                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                        <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {displayName}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {username ? `@${username} • ` : ''}ID: {entryId}
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '2px' }}>
                                          Added by: {addedBy}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveModWhitelist(entryId)}
                                      className="btn-danger"
                                      style={{
                                        border: 'none',
                                        background: 'rgba(239, 68, 68, 0.12)',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        flexShrink: 0
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Subtab 2: ROLES */}
                    {modWhitelistActiveSubtab === 'roles' && (
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                              Members who possess any checked role will be completely exempt from all moderation rules.
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={handleSelectAllModRoles}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllModRoles}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              Deselect All
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Filter roles by name..."
                          value={modRoleSearchQuery}
                          onChange={(e) => setModRoleSearchQuery(e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', marginBottom: '12px', fontSize: '0.85rem' }}
                        />

                        <div style={{
                          maxHeight: '260px',
                          overflowY: 'auto',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '12px',
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                          gap: '8px'
                        }}>
                          {roles
                            .filter(r => r.name !== '@everyone')
                            .filter(r => !modRoleSearchQuery || r.name.toLowerCase().includes(modRoleSearchQuery.toLowerCase()))
                            .map(r => {
                              const isChecked = (settings.moderation?.whitelistedRoles || []).some(item =>
                                (typeof item === 'string' ? item : item.roleId) === r.id
                              );
                              return (
                                <label
                                  key={r.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleModRole(r)}
                                    style={{ accentColor: '#10b981' }}
                                  />
                                  <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: r.color && r.color !== '#000000' && r.color !== 0 ? (typeof r.color === 'number' ? `#${r.color.toString(16).padStart(6, '0')}` : r.color) : '#94a3b8'
                                  }}></div>
                                  <span style={{
                                    fontSize: '0.88rem',
                                    fontWeight: '500',
                                    color: r.color && r.color !== '#000000' && r.color !== 0 ? (typeof r.color === 'number' ? `#${r.color.toString(16).padStart(6, '0')}` : r.color) : '#ffffff',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    @{r.name}
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Subtab 3: CHANNELS */}
                    {modWhitelistActiveSubtab === 'channels' && (
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                              Messages posted in these channels are completely exempt from spam blockers, link guards, photo spam, and word filters.
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={handleSelectAllModChannels}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllModChannels}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              Deselect All
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Filter channels by name..."
                          value={modChannelSearchQuery}
                          onChange={(e) => setModChannelSearchQuery(e.target.value)}
                          className="glass-input"
                          style={{ width: '100%', marginBottom: '12px', fontSize: '0.85rem' }}
                        />

                        <div style={{
                          maxHeight: '260px',
                          overflowY: 'auto',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '12px',
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: '8px'
                        }}>
                          {channels
                            .filter(ch => !modChannelSearchQuery || ch.name.toLowerCase().includes(modChannelSearchQuery.toLowerCase()))
                            .map(ch => {
                              const isChecked = (settings.moderation?.whitelistedChannels || []).includes(ch.id);
                              return (
                                <label
                                  key={ch.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleModChannel(ch.id)}
                                    style={{ accentColor: '#10b981' }}
                                  />
                                  <span style={{ fontSize: '0.88rem', fontWeight: '500', color: isChecked ? '#34d399' : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    #{ch.name}
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 1: Spam Protection */}
                  <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Spam Message Blocker</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deletes spam messages and automatically applies timeouts to spamming users.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.moderation.spam.enabled}
                          onChange={() => handleToggle('moderation.spam.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.moderation.spam.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Spam Threshold (messages)</label>
                            <input
                              type="number"
                              min="2"
                              max="30"
                              value={settings.moderation.spam.maxMessages ?? 5}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.spam.maxMessages', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Interval Window (seconds)</label>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={settings.moderation.spam.timeWindow === '' ? '' : (settings.moderation.spam.timeWindow !== undefined ? settings.moderation.spam.timeWindow / 1000 : 5)}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.spam.timeWindow', val === '' ? '' : parseInt(val) * 1000);
                              }}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Auto Timeout Duration (minutes)</label>
                            <input
                              type="number"
                              min="1"
                              max="1440"
                              value={settings.moderation.spam.timeoutDuration ?? 5}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.spam.timeoutDuration', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Spam Protected Channels</label>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Select channels here where spam protection will be active.</p>
                          <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            {channels.map(ch => (
                              <label key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input
                                  type="checkbox"
                                  checked={(settings.moderation.spam.protectedChannels || []).includes(ch.id)}
                                  onChange={(e) => {
                                    const current = [...(settings.moderation.spam.protectedChannels || [])];
                                    if (e.target.checked) {
                                      current.push(ch.id);
                                    } else {
                                      const index = current.indexOf(ch.id);
                                      if (index > -1) current.splice(index, 1);
                                    }
                                    handleInputChange('moderation.spam.protectedChannels', current);
                                  }}
                                />
                                #{ch.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Link Protection */}
                  <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Link Protection & Filters</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instantly blocks and deletes links posted in guarded text channels.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.moderation.links.enabled}
                          onChange={() => handleToggle('moderation.links.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.moderation.links.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Allowed Link Whitelist (one domain per line, e.g. youtube.com)</label>
                          <textarea
                            rows="3"
                            placeholder="youtube.com&#10;discord.gg"
                            value={settings.moderation.links.allowedLinks.join('\n')}
                            onChange={(e) => handleInputChange('moderation.links.allowedLinks', e.target.value.split('\n').filter(Boolean))}
                            className="glass-input"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Link Protected Channels</label>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Select channels here where link protection will be active.</p>
                          <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            {channels.map(ch => (
                              <label key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input
                                  type="checkbox"
                                  checked={(settings.moderation.links.protectedChannels || []).includes(ch.id)}
                                  onChange={(e) => {
                                    const current = [...(settings.moderation.links.protectedChannels || [])];
                                    if (e.target.checked) {
                                      current.push(ch.id);
                                    } else {
                                      const index = current.indexOf(ch.id);
                                      if (index > -1) current.splice(index, 1);
                                    }
                                    handleInputChange('moderation.links.protectedChannels', current);
                                  }}
                                />
                                #{ch.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Photo Spam Protection */}
                  <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', backgroundColor: 'rgba(255,255,255,0.01)', overflow: 'visible' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Photo Spam Protection</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detects users spamming photos/images across any channel in the server, deletes the messages, and issues a timeout.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.moderation?.photoSpam?.enabled || false}
                          onChange={() => handleToggle('moderation.photoSpam.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {(settings.moderation?.photoSpam?.enabled) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Photo Threshold (images)</label>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={settings.moderation?.photoSpam?.maxPhotos ?? 3}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.photoSpam.maxPhotos', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Interval Window (seconds)</label>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={settings.moderation?.photoSpam?.timeWindow === '' ? '' : (settings.moderation?.photoSpam?.timeWindow !== undefined ? settings.moderation.photoSpam.timeWindow / 1000 : 10)}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.photoSpam.timeWindow', val === '' ? '' : parseInt(val) * 1000);
                              }}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Auto Timeout Duration (minutes)</label>
                            <input
                              type="number"
                              min="1"
                              max="1440"
                              value={settings.moderation?.photoSpam?.timeoutDuration ?? 10}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.photoSpam.timeoutDuration', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Photo Spam Protected Channels</label>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Select channels here where photo spam protection will be active. Uploading more than the allowed photos in these selected channels issues an immediate spot timeout.</p>
                          <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            {channels.map(ch => {
                              const isChecked = (settings.moderation?.photoSpam?.protectedChannels || settings.moderation?.photoSpam?.whitelistedChannels || []).includes(ch.id);
                              return (
                                <label key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const current = [...(settings.moderation?.photoSpam?.protectedChannels || settings.moderation?.photoSpam?.whitelistedChannels || [])];
                                      if (e.target.checked) {
                                        current.push(ch.id);
                                      } else {
                                        const index = current.indexOf(ch.id);
                                        if (index > -1) current.splice(index, 1);
                                      }
                                      handleInputChange('moderation.photoSpam.protectedChannels', current);
                                      handleInputChange('moderation.photoSpam.whitelistedChannels', current);
                                    }}
                                  />
                                  #{ch.name}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Photo Spam Whitelist Notice */}
                        <div style={{
                          marginTop: '16px',
                          padding: '14px 18px',
                          borderRadius: '10px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#34d399'
                            }}>
                              <ShieldCheck size={18} />
                            </div>
                            <div>
                              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff', display: 'block' }}>
                                Moderation Full Whitelist Active
                              </span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Members, roles, and channels in the Full Whitelist section above are automatically exempt from Photo Spam.
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{
                              fontSize: '0.78rem',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              fontWeight: '600',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              {(settings.moderation?.whitelistedUsers || []).length} Users • {(settings.moderation?.whitelistedRoles || []).length} Roles • {(settings.moderation?.whitelistedChannels || []).length} Channels
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Auto Moderation & Word Filter System */}
                  <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', backgroundColor: 'rgba(255,255,255,0.01)', overflow: 'visible' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>Auto Moderation & Word Filter</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Automatically detects, deletes, and logs messages containing forbidden words or phrases across all channels (including voice text chats).
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings?.moderation?.wordFilter?.enabled || false}
                          onChange={() => handleToggle('moderation.wordFilter.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings?.moderation?.wordFilter?.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>

                        {/* Feature Toggles */}
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>System Feature Toggles</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block' }}>Auto-Delete Message</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Removes forbidden message</span>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings?.moderation?.wordFilter?.autoDelete !== false}
                                  onChange={() => handleToggle('moderation.wordFilter.autoDelete')}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block' }}>Auto-Timeout User</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applies timed mute</span>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings?.moderation?.wordFilter?.autoTimeout !== false}
                                  onChange={() => handleToggle('moderation.wordFilter.autoTimeout')}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block' }}>Send Channel Warning</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-deleting alert</span>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings?.moderation?.wordFilter?.sendAlert !== false}
                                  onChange={() => handleToggle('moderation.wordFilter.sendAlert')}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block' }}>Strict Anti-Bypass</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spaces, dots, homoglyphs</span>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings?.moderation?.wordFilter?.strictBypassProtection !== false}
                                  onChange={() => handleToggle('moderation.wordFilter.strictBypassProtection')}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>

                          </div>
                        </div>

                        {/* Controls Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Punishment Action</label>
                            <select
                              className="glass-input"
                              value={settings?.moderation?.wordFilter?.action || 'delete_timeout'}
                              onChange={(e) => handleInputChange('moderation.wordFilter.action', e.target.value)}
                            >
                              <option value="delete_timeout">Delete Message & Timeout User</option>
                              <option value="delete">Delete Message Only</option>
                              <option value="delete_warn">Delete Message & Channel Warning Only</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Violation Limit (Limit Before Timeout)</label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={settings?.moderation?.wordFilter?.maxViolations ?? 3}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.wordFilter.maxViolations', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                              placeholder="3"
                            />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                              Allowed word offenses before giving a timeout (e.g. 3 = first 3 times detected & logged, 4th causes timeout).
                            </span>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Timeout Duration (minutes)</label>
                            <input
                              type="number"
                              min="1"
                              max="1440"
                              value={settings?.moderation?.wordFilter?.timeoutDuration ?? 10}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange('moderation.wordFilter.timeoutDuration', val === '' ? '' : parseInt(val));
                              }}
                              className="glass-input"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Discord Moderation Log Channel</label>
                            <select
                              className="glass-input"
                              value={settings?.moderation?.wordFilter?.logChannelId || ''}
                              onChange={(e) => handleInputChange('moderation.wordFilter.logChannelId', e.target.value)}
                            >
                              <option value="">-- No Logging (Disabled) --</option>
                              {channels.map(ch => (
                                <option key={ch.id} value={ch.id}>#{ch.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Channel Alert Message Template</label>
                          <input
                            type="text"
                            placeholder="{user}, your message contained a forbidden word and was removed."
                            value={settings?.moderation?.wordFilter?.alertMessage || ''}
                            onChange={(e) => handleInputChange('moderation.wordFilter.alertMessage', e.target.value)}
                            className="glass-input"
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            Available placeholders: <code>{`{user}`}</code> (mention), <code>{`{username}`}</code>, <code>{`{server}`}</code>.
                          </span>
                        </div>

                        {/* Filtered Words List & Management */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                                Filtered Words & Phrases Directory ({settings?.moderation?.wordFilter?.words?.length || 0})
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Messages matching any word or pattern here will trigger auto moderation actions.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => setShowWordBulkModal(true)}
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 14px' }}
                              >
                                <UploadCloud size={16} /> Bulk Upload (TXT / CSV)
                              </button>

                              {settings?.moderation?.wordFilter?.words?.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to clear ALL filtered words?')) {
                                      handleInputChange('moderation.wordFilter.words', []);
                                    }
                                  }}
                                  className="btn-danger"
                                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                >
                                  Clear All
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Add single word & search row */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="Type word or phrase to filter..."
                                value={wordFilterInput}
                                onChange={(e) => setWordFilterInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (wordFilterInput.trim()) {
                                      const currentWords = settings?.moderation?.wordFilter?.words || [];
                                      const newWord = wordFilterInput.trim().toLowerCase();
                                      if (!currentWords.includes(newWord)) {
                                        handleInputChange('moderation.wordFilter.words', [...currentWords, newWord]);
                                      }
                                      setWordFilterInput('');
                                    }
                                  }
                                }}
                                className="glass-input"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (wordFilterInput.trim()) {
                                    const currentWords = settings?.moderation?.wordFilter?.words || [];
                                    const newWord = wordFilterInput.trim().toLowerCase();
                                    if (!currentWords.includes(newWord)) {
                                      handleInputChange('moderation.wordFilter.words', [...currentWords, newWord]);
                                    }
                                    setWordFilterInput('');
                                  }
                                }}
                                className="btn-primary"
                                style={{ padding: '0 18px', whiteSpace: 'nowrap' }}
                              >
                                Add Word
                              </button>
                            </div>

                            <input
                              type="text"
                              placeholder="🔍 Search active word list..."
                              value={wordFilterSearch}
                              onChange={(e) => setWordFilterSearch(e.target.value)}
                              className="glass-input"
                            />
                          </div>

                          {/* Word Chips Display Container */}
                          <div style={{
                            maxHeight: '220px',
                            overflowY: 'auto',
                            padding: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            {(!settings?.moderation?.wordFilter?.words || settings.moderation.wordFilter.words.length === 0) ? (
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', width: '100%', textAlign: 'center', margin: '20px 0' }}>
                                No filtered words configured yet. Type a word above or click "Bulk Upload" to add words.
                              </p>
                            ) : (
                              settings.moderation.wordFilter.words
                                .filter(w => !wordFilterSearch || w.toLowerCase().includes(wordFilterSearch.toLowerCase()))
                                .map((w, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: 'rgba(59, 130, 246, 0.15)',
                                      color: '#93c5fd',
                                      border: '1px solid rgba(59, 130, 246, 0.3)',
                                      padding: '4px 10px',
                                      borderRadius: '20px',
                                      fontSize: '0.85rem',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {w}
                                    <X
                                      size={14}
                                      style={{ cursor: 'pointer', opacity: 0.7 }}
                                      onClick={() => {
                                        const updated = settings.moderation.wordFilter.words.filter(item => item !== w);
                                        handleInputChange('moderation.wordFilter.words', updated);
                                      }}
                                    />
                                  </span>
                                ))
                            )}
                          </div>
                        </div>

                        {/* Role & User Whitelists */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                          {/* Role Whitelist */}
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Whitelisted Roles</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Members with any of these roles bypass the word filter completely.</p>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                              {roles.map(r => {
                                const isRoleChecked = (settings?.moderation?.wordFilter?.whitelistedRoles || []).some(item => item.roleId === r.id);
                                return (
                                  <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input
                                      type="checkbox"
                                      checked={isRoleChecked}
                                      onChange={(e) => {
                                        const currentRoles = [...(settings?.moderation?.wordFilter?.whitelistedRoles || [])];
                                        if (e.target.checked) {
                                          currentRoles.push({ roleId: r.id, name: r.name, color: r.color });
                                        } else {
                                          const idx = currentRoles.findIndex(item => item.roleId === r.id);
                                          if (idx > -1) currentRoles.splice(idx, 1);
                                        }
                                        handleInputChange('moderation.wordFilter.whitelistedRoles', currentRoles);
                                      }}
                                    />
                                    <span style={{ color: r.color && r.color !== '#000000' ? r.color : '#ffffff', fontWeight: '500' }}>@{r.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* User Whitelist */}
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Whitelisted Users</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Specific users who bypass word filter checks.</p>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                              <input
                                type="text"
                                placeholder="Search username or user ID..."
                                value={wordWhitelistSearchQuery}
                                onChange={(e) => setWordWhitelistSearchQuery(e.target.value)}
                                className="glass-input"
                                style={{ fontSize: '0.85rem' }}
                              />
                            </div>

                            {wordWhitelistSearchQuery && (
                              <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(25,25,35,0.95)', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '10px' }}>
                                {allMembers
                                  .filter(m => (m.username?.toLowerCase().includes(wordWhitelistSearchQuery.toLowerCase()) || m.id?.includes(wordWhitelistSearchQuery)))
                                  .map(m => (
                                    <div
                                      key={m.id}
                                      onClick={() => {
                                        const current = settings?.moderation?.wordFilter?.whitelistedUsers || [];
                                        if (!current.some(u => u.userId === m.id)) {
                                          handleInputChange('moderation.wordFilter.whitelistedUsers', [...current, { userId: m.id, username: m.username, displayName: m.displayName, avatar: m.avatar }]);
                                        }
                                        setWordWhitelistSearchQuery('');
                                      }}
                                      style={{ padding: '6px 10px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}
                                    >
                                      {m.displayName} (@{m.username})
                                    </div>
                                  ))}
                              </div>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {(settings?.moderation?.wordFilter?.whitelistedUsers || []).map(u => (
                                <span key={u.userId} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  {u.username || u.userId}
                                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => {
                                    const updated = (settings?.moderation?.wordFilter?.whitelistedUsers || []).filter(x => x.userId !== u.userId);
                                    handleInputChange('moderation.wordFilter.whitelistedUsers', updated);
                                  }} />
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Interactive Anti-Bypass Tester / Playground */}
                        <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#c084fc', marginBottom: '4px' }}>
                            ⚡ Interactive Anti-Bypass Tester
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            Test strings against your active word list to verify anti-bypass detection (handles dots, spaces, homoglyphs, and repeated chars).
                          </p>

                          <input
                            type="text"
                            placeholder="Type test message (e.g. w.o.r.d, w0rd, f u c k)..."
                            value={wordFilterTestInput}
                            onChange={(e) => setWordFilterTestInput(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', marginBottom: '10px' }}
                          />

                          {wordFilterTestInput && (() => {
                            const testRes = testWordFilter(wordFilterTestInput, settings?.moderation?.wordFilter?.words || [], settings?.moderation?.wordFilter?.strictBypassProtection !== false);
                            return (
                              <div style={{ padding: '10px 14px', borderRadius: '8px', background: testRes.containsForbidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', border: testRes.containsForbidden ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)' }}>
                                {testRes.containsForbidden ? (
                                  <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    🚨 CAUGHT BY FILTER! Detected Word: "{testRes.detectedWord}" ({testRes.matchedPattern})
                                  </span>
                                ) : (
                                  <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    ✅ PASSED (No forbidden words detected)
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: FULL MODERATION (ADMIN ROLE LOCKDOWN) */}
              {activeTab === 'fullmoderation' && settings && (
                <div>
                  {/* Master Status Panel */}
                  <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.1))',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f87171'
                        }}>
                          <Lock size={24} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Full Moderation (Admin Role Lockdown)</h3>
                            <span style={{ fontSize: '0.68rem', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>SECURITY</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                            When active, even administrators with the Administrator permission CANNOT create roles or assign any roles to members unless they are in the whitelist.
                          </p>
                        </div>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.fullModeration?.enabled || false}
                          onChange={() => handleToggle('fullModeration.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.fullModeration?.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Breach Enforcement Action</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Action taken against non-whitelisted administrators who create or give roles.</p>
                            <select
                              className="glass-input"
                              value={settings.fullModeration?.punishment || 'strip_admin'}
                              onChange={(e) => handleInputChange('fullModeration.punishment', e.target.value)}
                            >
                              <option value="strip_admin">Strip Admin & Management Roles (Recommended)</option>
                              <option value="timeout">Spot Timeout (Mute Administrator)</option>
                              <option value="stripall">Strip All Server Roles</option>
                              <option value="kick">Kick Administrator</option>
                              <option value="ban">Ban Administrator</option>
                              <option value="revert_only">Revert Action Only (No penalty)</option>
                            </select>
                          </div>

                          {settings.fullModeration?.punishment === 'timeout' && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Spot Timeout Duration (minutes)</label>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Duration in minutes to time out the offending administrator.</p>
                              <input
                                type="number"
                                min="1"
                                max="1440"
                                value={settings.fullModeration?.timeoutDuration ?? 60}
                                onChange={(e) => handleInputChange('fullModeration.timeoutDuration', e.target.value === '' ? '' : parseInt(e.target.value))}
                                className="glass-input"
                              />
                            </div>
                          )}

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Security Alert Log Channel</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Channel where unauthorized role creation & assignment alerts are posted.</p>
                            <select
                              className="glass-input"
                              value={settings.fullModeration?.logChannelId || ''}
                              onChange={(e) => handleInputChange('fullModeration.logChannelId', e.target.value)}
                            >
                              <option value="">-- Select Log Channel --</option>
                              {channels.map(ch => (
                                <option key={ch.id} value={ch.id}>#{ch.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {settings.fullModeration?.enabled && (
                    <>
                      {/* Administrative Lockdown Controls Grid */}
                      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                              Administrative Protection Options
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                              Toggle each protection rule. For each option, you can configure an independent whitelist of authorized administrators or roles.
                            </p>
                          </div>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                            ENFORCED ON ALL ADMINISTRATORS
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                          {[
                            {
                              key: 'channel_create',
                              field: 'preventChannelCreate',
                              title: 'Create Channels',
                              desc: 'Admins cannot create channels without whitelist. If created, the channel is instantly deleted.',
                              icon: Hash,
                              color: '#10b981'
                            },
                            {
                              key: 'channel_delete',
                              field: 'preventChannelDelete',
                              title: 'Delete Channels',
                              desc: 'Admins cannot delete channels without whitelist. If deleted, the channel is automatically restored.',
                              icon: Trash2,
                              color: '#ef4444'
                            },
                            {
                              key: 'member_kick',
                              field: 'preventMemberKick',
                              title: 'Kick Members',
                              desc: 'Admins cannot kick members without whitelist. Admin is penalized and breach is logged.',
                              icon: UserX,
                              color: '#f59e0b'
                            },
                            {
                              key: 'member_ban',
                              field: 'preventMemberBan',
                              title: 'Ban Members',
                              desc: 'Admins cannot ban members without whitelist. If banned, the member is instantly unbanned.',
                              icon: ShieldAlert,
                              color: '#dc2626'
                            },
                            {
                              key: 'member_timeout',
                              field: 'preventMemberTimeout',
                              title: 'Timeout Members',
                              desc: 'Admins cannot timeout or mute members without whitelist. If applied, timeout is instantly cleared.',
                              icon: Clock,
                              color: '#eab308'
                            },
                            {
                              key: 'voice_mute',
                              field: 'preventVoiceMute',
                              title: 'Voice Mute Members',
                              desc: 'Admins cannot server-mute members in voice channels without whitelist. If muted, instantly unmuted.',
                              icon: MicOff,
                              color: '#6366f1'
                            },
                            {
                              key: 'voice_disconnect',
                              field: 'preventVoiceDisconnect',
                              title: 'Voice Disconnect Members',
                              desc: 'Admins cannot disconnect members from voice channels without whitelist. Admin is penalized and logged.',
                              icon: PhoneOff,
                              color: '#a855f7'
                            },
                            {
                              key: 'role_create',
                              field: 'preventRoleCreate',
                              title: 'Create Roles',
                              desc: 'Admins cannot create roles without whitelist. If created, the role is instantly deleted.',
                              icon: Award,
                              color: '#8b5cf6'
                            },
                            {
                              key: 'role_give',
                              field: 'preventRoleGive',
                              title: 'Give / Assign Roles',
                              desc: 'Admins cannot give roles to members without whitelist. If given, roles are immediately stripped.',
                              icon: UserCheck,
                              color: '#3b82f6'
                            },
                            {
                              key: 'role_delete',
                              field: 'preventRoleDelete',
                              title: 'Delete Roles',
                              desc: 'Admins cannot delete roles without whitelist. If deleted, the role is automatically restored.',
                              icon: Trash2,
                              color: '#ec4899'
                            },
                            {
                              key: 'message_delete',
                              field: 'preventMessageDelete',
                              title: 'Delete Messages',
                              desc: 'Admins cannot delete other members\' messages without whitelist. Admin is penalized and logged.',
                              icon: MessageSquare,
                              color: '#06b6d4'
                            },
                            {
                              key: 'server_settings',
                              field: 'preventServerSettings',
                              title: 'Server Settings Access',
                              desc: 'Admins cannot view or open Server Settings in dashboard or modify server settings in Discord without whitelist.',
                              icon: Settings,
                              color: '#f97316'
                            }
                          ].map(opt => {
                            const IconComponent = opt.icon;
                            const isEnabled = settings.fullModeration?.[opt.field] !== false;
                            const actionWhitelistData = settings.fullModeration?.actionWhitelists?.[opt.key] || { users: [], roles: [] };
                            const whitelistedUsersCount = (actionWhitelistData.users || []).length;
                            const whitelistedRolesCount = (actionWhitelistData.roles || []).length;
                            const totalWhitelisted = whitelistedUsersCount + whitelistedRolesCount;

                            return (
                              <div
                                key={opt.key}
                                className="glass-panel"
                                style={{
                                  padding: '18px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  backgroundColor: 'rgba(0,0,0,0.18)',
                                  border: isEnabled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.03)',
                                  borderRadius: '10px',
                                  gap: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '8px',
                                      backgroundColor: `${opt.color}20`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: opt.color,
                                      flexShrink: 0
                                    }}>
                                      <IconComponent size={18} />
                                    </div>
                                    <div>
                                      <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                                        {opt.title}
                                      </h4>
                                      <span style={{ fontSize: '0.7rem', color: isEnabled ? '#34d399' : '#94a3b8', fontWeight: '600' }}>
                                        {isEnabled ? '● Active Lockdown' : '○ Disabled'}
                                      </span>
                                    </div>
                                  </div>

                                  <label className="switch" style={{ scale: '0.85', margin: 0 }}>
                                    <input
                                      type="checkbox"
                                      checked={isEnabled}
                                      onChange={() => handleToggle(`fullModeration.${opt.field}`)}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </div>

                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                                  {opt.desc}
                                </p>

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '10px',
                                  borderTop: '1px solid rgba(255,255,255,0.05)',
                                  gap: '8px'
                                }}>
                                  <div style={{ fontSize: '0.75rem', color: totalWhitelisted > 0 ? '#60a5fa' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Lock size={12} />
                                    <span>
                                      {totalWhitelisted > 0
                                        ? `${whitelistedUsersCount} users, ${whitelistedRolesCount} roles`
                                        : 'No specific whitelist'}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setActionWhitelistModal({ actionKey: opt.key, title: opt.title, desc: opt.desc })}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                                      border: '1px solid rgba(59, 130, 246, 0.28)',
                                      color: '#93c5fd',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <Users size={12} />
                                    <span>Whitelist Option</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Modal for Per-Option Whitelist */}
                      {actionWhitelistModal && (
                        <div
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.78)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 99999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px'
                          }}
                          onClick={() => setActionWhitelistModal(null)}
                        >
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '560px',
                              backgroundColor: '#1b1d24',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '14px',
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                              padding: '24px',
                              color: '#f2f3f5',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '18px',
                              maxHeight: '90vh',
                              overflowY: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Modal Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Lock size={18} color="#ef4444" />
                                  Whitelist: {actionWhitelistModal.title}
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                                  Whitelisted administrators or roles can perform "{actionWhitelistModal.title}". All other administrators will be blocked.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActionWhitelistModal(null)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                              >
                                <X size={20} />
                              </button>
                            </div>

                            {/* Default Immunity Banner */}
                            <div style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(59, 130, 246, 0.08)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              fontSize: '0.8rem',
                              color: '#93c5fd',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <CheckCircle size={16} color="#60a5fa" />
                              <span>👑 Server Owner & 🤖 Bot are automatically immune & whitelisted.</span>
                            </div>

                            {/* Search and Add User specifically for this option */}
                            <div style={{ position: 'relative', zIndex: 10 }}>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Search and Add Administrator for this Option
                              </label>

                              <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                  <input
                                    type="text"
                                    placeholder="Type username or member ID to search..."
                                    value={actionWhitelistSearchQuery}
                                    onChange={(e) => setActionWhitelistSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleManualAddActionUserWhitelist(actionWhitelistModal.actionKey);
                                      }
                                    }}
                                    className="glass-input"
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem' }}
                                  />
                                  {actionWhitelistSearchLoading && (
                                    <div style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                      Searching...
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleManualAddActionUserWhitelist(actionWhitelistModal.actionKey)}
                                  className="btn-primary"
                                  style={{ padding: '0 18px', height: '42px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  Add
                                </button>
                              </div>

                              {actionWhitelistSearchedMembers.length > 0 && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: '100%',
                                    background: 'rgba(25, 25, 35, 0.98)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    marginTop: '5px',
                                    maxHeight: '180px',
                                    overflowY: 'auto',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(10px)',
                                    zIndex: 1000
                                  }}
                                >
                                  {actionWhitelistSearchedMembers
                                    .filter(m => !(settings.fullModeration?.actionWhitelists?.[actionWhitelistModal.actionKey]?.users || []).some(u => (typeof u === 'string' ? u === m.id : u.userId === m.id)))
                                    .map(m => (
                                      <div
                                        key={m.id}
                                        onClick={() => {
                                          handleAddActionUserWhitelist(actionWhitelistModal.actionKey, m.id, m);
                                          setActionWhitelistSearchQuery('');
                                          setActionWhitelistSearchedMembers([]);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          padding: '8px 12px',
                                          cursor: 'pointer',
                                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                        className="search-item"
                                      >
                                        <img
                                          src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                          style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                                          alt="avatar"
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>{m.displayName}</span>
                                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{m.username} • {m.id}</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>

                            {/* Currently Whitelisted Users List for this Action */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Whitelisted Administrators ({settings.fullModeration?.actionWhitelists?.[actionWhitelistModal.actionKey]?.users?.length || 0})
                              </label>

                              {(!settings.fullModeration?.actionWhitelists?.[actionWhitelistModal.actionKey]?.users || settings.fullModeration.actionWhitelists[actionWhitelistModal.actionKey].users.length === 0) ? (
                                <div style={{ padding: '14px', textAlign: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                  No administrators individually whitelisted for this option yet.
                                </div>
                              ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                                  {settings.fullModeration.actionWhitelists[actionWhitelistModal.actionKey].users.map(u => {
                                    const uId = typeof u === 'string' ? u : u.userId;
                                    const uName = typeof u === 'string' ? u : (u.displayName || u.username || u.userId);
                                    const uAvatar = typeof u === 'object' && u.avatar ? u.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png';

                                    return (
                                      <div
                                        key={uId}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: '8px 10px',
                                          background: 'rgba(0,0,0,0.25)',
                                          border: '1px solid var(--border-color)',
                                          borderRadius: '6px'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                          <img src={uAvatar} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
                                          <span style={{ fontSize: '0.8rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {uName}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveActionUserWhitelist(actionWhitelistModal.actionKey, uId)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#f87171',
                                            cursor: 'pointer',
                                            padding: '2px 6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Whitelisted Roles for this Action */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Whitelisted Roles for this Option
                              </label>

                              <div style={{ maxHeight: '130px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                {roles.filter(r => r.name !== '@everyone').map(role => {
                                  const isChecked = (settings.fullModeration?.actionWhitelists?.[actionWhitelistModal.actionKey]?.roles || []).includes(role.id);
                                  return (
                                    <label key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.85rem' }}>
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleActionRoleWhitelist(actionWhitelistModal.actionKey, role.id)}
                                      />
                                      <span style={{ color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#ffffff' }}>
                                        @{role.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Modal Close Button */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setActionWhitelistModal(null)}
                                className="btn-primary"
                                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Global Whitelist Manager */}
                      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)', overflow: 'visible' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Shield size={18} color="#3b82f6" />
                              Global Full Moderation Whitelist
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                              Administrators added here bypass <strong>ALL</strong> Full Moderation restrictions (e.g. Co-Owners, Head Admins).
                            </p>
                          </div>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                            ALL-ACCESS BYPASS
                          </span>
                        </div>

                        {/* Search and Add User */}
                        <div style={{ position: 'relative', zIndex: 10, margin: '20px 0' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Search and Add Global Administrator to Whitelist
                          </label>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Type username or member ID to search..."
                                value={fullModSearchQuery}
                                onChange={(e) => setFullModSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleManualAddFullModWhitelist();
                                  }
                                }}
                                className="glass-input"
                                style={{ width: '100%', padding: '12px' }}
                              />
                              {fullModSearchLoading && (
                                <div style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  Searching...
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={handleManualAddFullModWhitelist}
                              className="btn-primary"
                              style={{ padding: '0 24px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              Add
                            </button>
                          </div>

                          {fullModSearchedMembers.length > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: '100%',
                                background: 'rgba(25, 25, 35, 0.98)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                marginTop: '5px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 1000
                              }}
                            >
                              {fullModSearchedMembers
                                .filter(m => !(settings.fullModeration?.whitelistedUsers || []).some(u => (typeof u === 'string' ? u : u.userId) === m.id))
                                .map(m => (
                                  <div
                                    key={m.id}
                                    onClick={() => { handleAddFullModWhitelist(m.id, m); setFullModSearchQuery(''); setFullModSearchedMembers([]); }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '10px 14px',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                    className="search-item"
                                  >
                                    <img
                                      src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                      alt="avatar"
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{m.displayName}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{m.username} • {m.id}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Whitelisted Users Display */}
                        <div style={{ marginTop: '20px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>
                            Global Whitelisted Administrators ({settings.fullModeration?.whitelistedUsers?.length || 0})
                          </h4>

                          {(!settings.fullModeration?.whitelistedUsers || settings.fullModeration.whitelistedUsers.length === 0) ? (
                            <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              No global administrators added. Only Server Owner and individually whitelisted administrators will have permissions.
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                              {(settings.fullModeration.whitelistedUsers || []).map(u => {
                                const uId = typeof u === 'string' ? u : u.userId;
                                const uName = typeof u === 'string' ? u : (u.displayName || u.username || u.userId || 'User');
                                const uAvatar = typeof u === 'object' && u?.avatar ? u.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png';
                                return (
                                  <div
                                    key={uId}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '12px',
                                      background: 'rgba(0,0,0,0.2)',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: '8px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                      <img
                                        src={uAvatar}
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                        alt="avatar"
                                      />
                                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {uName}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                          ID: {uId}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFullModWhitelist(uId)}
                                      style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.25)',
                                        color: '#f87171',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.78rem'
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Global Whitelisted Roles Section */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '6px' }}>
                            Global Whitelisted Roles (Optional)
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            Members possessing any of these checked roles will bypass ALL Full Moderation restrictions.
                          </p>

                          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            {roles.filter(r => r.name !== '@everyone').map(role => {
                              const isChecked = (settings.fullModeration?.whitelistedRoles || []).includes(role.id);
                              return (
                                <label key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const current = [...(settings.fullModeration?.whitelistedRoles || [])];
                                      if (e.target.checked) {
                                        current.push(role.id);
                                      } else {
                                        const index = current.indexOf(role.id);
                                        if (index > -1) current.splice(index, 1);
                                      }
                                      handleInputChange('fullModeration.whitelistedRoles', current);
                                    }}
                                  />
                                  <span style={{ color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#ffffff' }}>
                                    @{role.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: WELCOME SYSTEM */}
              {/* TAB: ANTINUKE PROTECTION */}
              {activeTab === 'antinuke' && settings && settings.antinuke && (
                <div>

                  {/* Main Enable Panel */}
                  <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Anti-Nuker System Status</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Globally enable or disable automated protection actions against malicious actions.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.antinuke.enabled || false}
                          onChange={() => handleToggle('antinuke.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.antinuke.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Breach Response Action</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Punishment applied to administrators who breach limit thresholds.</p>
                            <select
                              className="glass-input"
                              value={settings.antinuke.punishment || 'stripall'}
                              onChange={(e) => handleInputChange('antinuke.punishment', e.target.value)}
                            >
                              <option value="stripall">Strip Admin Roles (Remove permissions)</option>
                              <option value="ban">Ban Executor</option>
                              <option value="kick">Kick Executor</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Action Limit Threshold</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Number of dangerous actions allowed before triggering penalty.</p>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={settings.antinuke.threshold ?? 3}
                              onChange={(e) => handleInputChange('antinuke.threshold', e.target.value === '' ? '' : parseInt(e.target.value))}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Rate Limit Timeframe (seconds)</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Duration in seconds to track consecutive actions.</p>
                            <input
                              type="number"
                              min="1"
                              max="3600"
                              value={settings.antinuke.timeframe ?? 60}
                              onChange={(e) => handleInputChange('antinuke.timeframe', e.target.value === '' ? '' : parseInt(e.target.value))}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Alert Log Channel</label>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Channel where automatic alerts and logs are sent.</p>
                            <select
                              className="glass-input"
                              value={settings.antinuke.logChannelId || ''}
                              onChange={(e) => handleInputChange('antinuke.logChannelId', e.target.value)}
                            >
                              <option value="">System Default Channel</option>
                              {channels.map(ch => (
                                <option key={ch.id} value={ch.id}>#{ch.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {settings.antinuke.enabled && (
                    <>
                      {/* Grid for Actions & Limits */}
                      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Protection Action Controls</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Enable specific protective monitors to defend your server against malicious activities.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                          {[
                            { key: 'antiBan', title: 'Anti-Ban Monitor', desc: 'Prevents rogue staff from mass banning members.' },
                            { key: 'antiKick', title: 'Anti-Kick Monitor', desc: 'Prevents rogue staff from mass kicking members.' },
                            { key: 'antiChannelCreate', title: 'Anti-Channel Create', desc: 'Prevents spam creation of channels by malicious accounts.' },
                            { key: 'antiChannelDelete', title: 'Anti-Channel Delete', desc: 'Prevents rogue staff from deleting channels.' },
                            { key: 'antiRoleCreate', title: 'Anti-Role Create', desc: 'Prevents creation of dangerous roles.' },
                            { key: 'antiRoleDelete', title: 'Anti-Role Delete', desc: 'Prevents rogue staff from deleting roles.' },
                            { key: 'antiRoleUpdate', title: 'Anti-Role Update', desc: 'Prevents adding dangerous permissions (e.g. Administrator) to roles.' },
                            { key: 'antiWebhook', title: 'Anti-Webhook Create', desc: 'Prevents unauthorized creation of webhooks.' },
                            { key: 'antiBot', title: 'Anti-Bot Additions', desc: 'Instantly kick unauthorized bots added to the server.' },
                            { key: 'antiGuildUpdate', title: 'Anti-Guild Update', desc: 'Prevents unauthorized editing of server settings.' },
                            { key: 'antiEmoji', title: 'Anti-Emoji Changes', desc: 'Prevents mass creation/deletion/editing of emojis.' },
                            { key: 'antiChannelEdit', title: 'Anti-Channel Edit', desc: 'Prevents mass unauthorized editing of channels.' }
                          ].map(opt => (
                            <div key={opt.key} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                              <div style={{ flex: 1, marginRight: '16px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{opt.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{opt.desc}</p>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings.antinuke[opt.key] || false}
                                  onChange={() => handleToggle(`antinuke.${opt.key}`)}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Whitelisted Users Whitelist manager */}
                      <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)', overflow: 'visible' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Whitelisted Administrators</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Whitelisted users bypass anti-nuker restrictions. Guild owner and the bot itself are whitelisted by default.</p>

                        <div style={{ position: 'relative', zIndex: 10, marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Search and Add Administrator to Whitelist</label>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <input
                                type="text"
                                placeholder="Type username or member ID to search..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleManualAddWhitelist();
                                  }
                                }}
                                className="glass-input"
                                style={{ width: '100%', padding: '12px' }}
                              />
                              {searchLoading && (
                                <div style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Searching...</div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={handleManualAddWhitelist}
                              className="btn-primary"
                              style={{ padding: '0 24px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              Add
                            </button>
                          </div>

                          {searchedMembers.length > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: '100%',
                                background: 'rgba(25, 25, 35, 0.98)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                marginTop: '5px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 1000
                              }}
                            >
                              {searchedMembers
                                .filter(m => !(settings.antinuke.whitelistedUsers || []).some(u => u.userId === m.id))
                                .map(m => (
                                  <div
                                    key={m.id}
                                    onClick={() => { handleAddWhitelist(m.id, selectedWhitelistEvents, m); setMemberSearchQuery(''); }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '10px 14px',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                    className="search-item"
                                  >
                                    <img
                                      src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{m.displayName}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{m.username} • {m.id}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* Specific Event Whitelist Selection */}
                          <div style={{ marginTop: '14px', padding: '16px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              Optional: Whitelist only for specific events (Keep unselected to whitelist for ALL events)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                              {[
                                { id: 'ban', label: 'Anti Ban' },
                                { id: 'kick', label: 'Anti Kick' },
                                { id: 'channel_create', label: 'Anti Channel Create' },
                                { id: 'channel_delete', label: 'Anti Channel Delete' },
                                { id: 'role_create', label: 'Anti Role Create' },
                                { id: 'role_delete', label: 'Anti Role Delete' },
                                { id: 'role_update', label: 'Anti Role Update' },
                                { id: 'webhook_create', label: 'Anti Webhook' },
                                { id: 'bot_add', label: 'Anti Bot' },
                                { id: 'guild_update', label: 'Anti Guild Update' },
                                { id: 'emoji_create', label: 'Anti Emoji Create' },
                                { id: 'emoji_delete', label: 'Anti Emoji Delete' },
                                { id: 'emoji_update', label: 'Anti Emoji Update' },
                                { id: 'channel_edit', label: 'Anti Channel Edit' }
                              ].map(evOpt => (
                                <label key={evOpt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedWhitelistEvents.includes(evOpt.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedWhitelistEvents(prev => [...prev, evOpt.id]);
                                      } else {
                                        setSelectedWhitelistEvents(prev => prev.filter(x => x !== evOpt.id));
                                      }
                                    }}
                                  />
                                  {evOpt.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>Whitelisted Admins:</h4>
                          {(settings.antinuke.whitelistedUsers || []).length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No custom whitelisted users. Only the Server Owner and Bot have bypass privileges.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {(settings.antinuke.whitelistedUsers || []).map(entry => {
                                const details = getMemberDetails(entry.userId);
                                return (
                                  <div
                                    key={entry.userId}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '10px 16px',
                                      borderRadius: '8px',
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid var(--border-color)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <img
                                        src={details.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                      />
                                      <div>
                                        <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }}>
                                          {details.displayName} {details.username && details.username !== entry.userId && `(@${details.username})`} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(ID: {entry.userId})</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                          Added by: {entry.addedBy || 'Unknown'} • Whitelisted for: {(!entry.events || entry.events.length === 0) ? 'All Events' : entry.events.join(', ')}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveWhitelist(entry.userId)}
                                      className="btn-danger"
                                      style={{
                                        border: 'none',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'welcome' && (
                <div>

                  <div className="glass-panel" style={{
                    padding: '24px',
                    marginBottom: '24px',
                    backgroundColor: 'rgba(10, 12, 22, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    overflow: 'visible'
                  }}>
                    {/* Main Section Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                        Welcome Messages & Image Banner
                      </h3>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.welcome.enabled}
                          onChange={() => handleToggle('welcome.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.welcome.enabled && (() => {
                      const count = memberCount || 11;
                      const ordinal = getOrdinal(count);

                      const formatWelcomeText = (text) => {
                        if (!text) return '';
                        let str = text;
                        const username = user?.username ? `@${user.username}` : '@_kallushappu_0007';
                        const server = guildName || 'KALLU SHAPPU';

                        const ch1 = channels.find(c => c.id === settings.welcome.redirectChannelId);
                        const ch2 = channels.find(c => c.id === settings.welcome.redirectChannelId2);
                        const ch3 = channels.find(c => c.id === settings.welcome.redirectChannelId3);

                        str = str.replace(/\{user\}/gi, username);
                        str = str.replace(/\{username\}/gi, user?.username || '_kallushappu_0007');
                        str = str.replace(/\{server\}/gi, server);
                        str = str.replace(/\{member_ordinal\}/gi, ordinal);
                        str = str.replace(/\{memberordinal\}/gi, ordinal);
                        str = str.replace(/\{ordinal\}/gi, ordinal);
                        str = str.replace(/\{member_count\}/gi, String(count));
                        str = str.replace(/\{membercount\}/gi, String(count));
                        str = str.replace(/\{count\}/gi, String(count));
                        str = str.replace(/\{member_number\}/gi, `#${count}`);
                        str = str.replace(/\{membernumber\}/gi, `#${count}`);
                        str = str.replace(/\{channel\}/gi, ch1 ? `#${ch1.name}` : '#channel');
                        str = str.replace(/\{channel2\}/gi, ch2 ? `#${ch2.name}` : '#channel2');
                        str = str.replace(/\{channel3\}/gi, ch3 ? `#${ch3.name}` : '#channel3');
                        return str;
                      };

                      const renderRedirectButton = () => {
                        const buttons = [];

                        if (settings.welcome.websiteUrl && settings.welcome.websiteUrl.trim()) {
                          let siteUrl = settings.welcome.websiteUrl.trim();
                          if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
                            siteUrl = `https://${siteUrl}`;
                          }
                          buttons.push({
                            label: '🌐 Website',
                            url: siteUrl
                          });
                        }

                        const redirect1 = channels.find(c => c.id === settings.welcome.redirectChannelId);
                        const redirect2 = channels.find(c => c.id === settings.welcome.redirectChannelId2);
                        const redirect3 = channels.find(c => c.id === settings.welcome.redirectChannelId3);

                        if (redirect1) buttons.push({ label: `#${redirect1.name}`, url: '#' });
                        if (redirect2) buttons.push({ label: `#${redirect2.name}`, url: '#' });
                        if (redirect3) buttons.push({ label: `#${redirect3.name}`, url: '#' });

                        if (buttons.length === 0) return null;

                        return (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                            {buttons.map((btn, idx) => (
                              <a
                                key={idx}
                                href={btn.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: '#4e5058',
                                  color: '#ffffff',
                                  padding: '4px 10px',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none',
                                  fontWeight: '500'
                                }}
                              >
                                {btn.label}
                              </a>
                            ))}
                          </div>
                        );
                      };

                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                          gap: '24px',
                          alignItems: 'start'
                        }}>
                          {/* LEFT COLUMN: Settings & Customization Controls */}
                          <div className="welcome-settings-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Layout Selection: Classic Embed vs Components V2 Container */}
                            <div style={{
                              backgroundColor: '#0a0c16',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <div>
                                  <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Layers size={18} color="#38bdf8" />
                                    Message Layout & Container Mode
                                  </span>
                                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                    Choose between Discord Classic Embed or modern Components V2 Container with Media Gallery (flags: 32768).
                                  </p>
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                                {/* Mode 1: Classic Embed */}
                                <button
                                  type="button"
                                  onClick={() => handleInputChange('welcome.layoutType', 'classic')}
                                  style={{
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    border: (settings.welcome.layoutType || 'classic') === 'classic'
                                      ? '2px solid #3b82f6'
                                      : '1px solid rgba(255, 255, 255, 0.08)',
                                    backgroundColor: (settings.welcome.layoutType || 'classic') === 'classic'
                                      ? 'rgba(59, 130, 246, 0.12)'
                                      : '#07080e',
                                    color: (settings.welcome.layoutType || 'classic') === 'classic' ? '#ffffff' : '#94a3b8',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: (settings.welcome.layoutType || 'classic') === 'classic' ? '#60a5fa' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>🖼️ Classic Embed & Canvas</span>
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                                    Single banner/canvas card, embed description & avatar
                                  </div>
                                </button>

                                {/* Mode 2: Components V2 Container (Media Gallery) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('welcome.layoutType', 'container');
                                    if (!settings.welcome.mediaGalleryItems || settings.welcome.mediaGalleryItems.length === 0) {
                                      handleInputChange('welcome.mediaGalleryItems', defaultWebcamItems);
                                    }
                                    if (!settings.welcome.textDisplayContent) {
                                      handleInputChange('welcome.textDisplayContent', 'Live webcam shots as of 18-04-2025 at 12:00 UTC');
                                    }
                                  }}
                                  style={{
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    border: (settings.welcome.layoutType === 'container')
                                      ? '2px solid #10b981'
                                      : '1px solid rgba(255, 255, 255, 0.08)',
                                    backgroundColor: (settings.welcome.layoutType === 'container')
                                      ? 'rgba(16, 185, 129, 0.12)'
                                      : '#07080e',
                                    color: (settings.welcome.layoutType === 'container') ? '#ffffff' : '#94a3b8',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: (settings.welcome.layoutType === 'container') ? '#34d399' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>✨ Components V2 Container</span>
                                    <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                                      NEW V2
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                                    Text Display (Type 10) & Media Gallery (Type 12) grid
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* --- CONDITIONAL SETTINGS: CONTAINER V2 OR CLASSIC --- */}
                            {settings.welcome.layoutType === 'container' ? (
                              <>
                                {/* 1. Greeting Channel & Container Accent Wrap Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '16px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Hash size={16} color="#38bdf8" />
                                    Greeting Channel & Container Accent
                                  </h4>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                                        Greeting Channel
                                      </label>
                                      <select
                                        value={settings.welcome.channelId || ''}
                                        onChange={(e) => handleInputChange('welcome.channelId', e.target.value)}
                                        className="glass-input"
                                        style={{
                                          backgroundColor: '#07080e',
                                          borderColor: 'rgba(255,255,255,0.08)',
                                          borderRadius: '8px',
                                          padding: '10px 14px',
                                          color: '#ffffff'
                                        }}
                                      >
                                        <option value="">-- Select Greeting Channel --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '500' }}>
                                          Wrap in Container (Type 17)
                                        </label>
                                        <label className="switch" style={{ scale: '0.8' }}>
                                          <input
                                            type="checkbox"
                                            checked={Boolean(settings.welcome.containerWrap !== false)}
                                            onChange={() => handleToggle('welcome.containerWrap')}
                                          />
                                          <span className="slider"></span>
                                        </label>
                                      </div>

                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        backgroundColor: '#07080e',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '8px',
                                        padding: '6px 12px',
                                        height: '42px',
                                        opacity: settings.welcome.containerWrap !== false ? 1 : 0.6
                                      }}>
                                        <input
                                          type="color"
                                          disabled={settings.welcome.containerWrap === false}
                                          value={settings.welcome.containerAccentColor?.startsWith('#') ? settings.welcome.containerAccentColor : `#${settings.welcome.containerAccentColor || '2563eb'}`}
                                          onChange={(e) => handleInputChange('welcome.containerAccentColor', e.target.value)}
                                          style={{
                                            width: '28px',
                                            height: '28px',
                                            padding: 0,
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: settings.welcome.containerWrap !== false ? 'pointer' : 'not-allowed',
                                            background: 'none'
                                          }}
                                        />
                                        <input
                                          type="text"
                                          disabled={settings.welcome.containerWrap === false}
                                          value={settings.welcome.containerAccentColor || '#2563eb'}
                                          onChange={(e) => handleInputChange('welcome.containerAccentColor', e.target.value)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontSize: '0.88rem',
                                            fontFamily: 'monospace',
                                            outline: 'none',
                                            width: '100%'
                                          }}
                                          placeholder="#2563eb"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                                    {settings.welcome.containerWrap !== false
                                      ? 'ℹ️ Wraps all welcome components inside Discord ComponentType.CONTAINER (Type 17) with the chosen accent strip.'
                                      : 'ℹ️ Sends directly as top-level components matching { flags: 32768, components: [...] }.'}
                                  </p>
                                </div>

                                {/* 2. Embed Title & Top-Right Thumbnail (Section Type 9 + Type 11) */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles size={16} color="#38bdf8" />
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                                      Container Header & Member Avatar Thumbnail
                                    </h4>
                                    <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                      SECTION (TYPE 9)
                                    </span>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                                        Header Title (Optional)
                                      </label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedTitle || ''}
                                        onChange={(e) => handleInputChange('welcome.embedTitle', e.target.value)}
                                        className="glass-input"
                                        placeholder="Welcome to {server}!"
                                        style={{
                                          backgroundColor: '#07080e',
                                          borderColor: 'rgba(255, 255, 255, 0.08)',
                                          borderRadius: '8px',
                                          color: '#ffffff',
                                          padding: '10px 14px',
                                          fontSize: '0.88rem'
                                        }}
                                      />
                                      {/* Supported tags chips for title */}
                                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Insert tag:</span>
                                        {['{user}', '{username}', '{server}', '{member_ordinal}', '{member_count}'].map((tag) => (
                                          <button
                                            key={tag}
                                            type="button"
                                            onClick={() => {
                                              const currentTitle = settings.welcome.embedTitle || '';
                                              handleInputChange('welcome.embedTitle', currentTitle + (currentTitle ? ' ' : '') + tag);
                                            }}
                                            style={{
                                              background: 'rgba(56, 189, 248, 0.1)',
                                              border: '1px solid rgba(56, 189, 248, 0.25)',
                                              color: '#38bdf8',
                                              padding: '2px 7px',
                                              borderRadius: '4px',
                                              fontSize: '0.72rem',
                                              fontFamily: 'monospace',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            {tag}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                                        Thumbnail Accessory (Top-Right)
                                      </label>
                                      <select
                                        value={settings.welcome.embedThumbnail || '{user_avatar}'}
                                        onChange={(e) => handleInputChange('welcome.embedThumbnail', e.target.value)}
                                        className="glass-input"
                                        style={{
                                          backgroundColor: '#07080e',
                                          borderColor: 'rgba(255, 255, 255, 0.08)',
                                          borderRadius: '8px',
                                          padding: '10px 14px',
                                          color: '#ffffff'
                                        }}
                                      >
                                        <option value="{user_avatar}">👤 Member Avatar (Default)</option>
                                        <option value="{server_icon}">🏰 Server Icon</option>
                                        <option value="none">❌ Disabled (No Thumbnail)</option>
                                      </select>
                                      <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px', marginBottom: 0 }}>
                                        Renders as an accessory (ComponentType.THUMBNAIL Type 11) alongside the title & description.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. Text Display (ComponentType.TEXT_DISPLAY, Type 10) */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} color="#60a5fa" />
                                        ComponentType.TEXT_DISPLAY (Type 10)
                                      </h4>
                                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                        Main welcome description text
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleInputChange('welcome.textDisplayContent', 'Welcome {user} to {server}!');
                                        handleInputChange('welcome.message', 'Welcome {user} to {server}!');
                                      }}
                                      style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#94a3b8',
                                        fontSize: '0.72rem',
                                        padding: '4px 8px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Reset to Default
                                    </button>
                                  </div>

                                  <textarea
                                    value={settings.welcome.textDisplayContent !== undefined ? settings.welcome.textDisplayContent : (settings.welcome.message || 'Welcome {user} to {server}!')}
                                    onChange={(e) => {
                                      handleInputChange('welcome.textDisplayContent', e.target.value);
                                      handleInputChange('welcome.message', e.target.value);
                                    }}
                                    className="glass-input"
                                    placeholder="Welcome {user} to {server}!"
                                    rows="3"
                                    style={{
                                      backgroundColor: '#07080e',
                                      borderColor: 'rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      color: '#ffffff',
                                      minHeight: '75px',
                                      resize: 'vertical',
                                      fontFamily: 'inherit',
                                      fontSize: '0.88rem',
                                      padding: '10px 14px'
                                    }}
                                  />

                                  {/* Supported tags chips */}
                                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Insert dynamic tag:</span>
                                    {['{user}', '{username}', '{server}', '{member_ordinal}', '{member_count}', '{member_number}', '{channel}', '{channel2}', '{channel3}'].map((tag) => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                          const current = settings.welcome.textDisplayContent !== undefined ? settings.welcome.textDisplayContent : (settings.welcome.message || 'Welcome {user} to {server}!');
                                          const updated = current + (current ? ' ' : '') + tag;
                                          handleInputChange('welcome.textDisplayContent', updated);
                                          handleInputChange('welcome.message', updated);
                                        }}
                                        style={{
                                          background: 'rgba(59, 130, 246, 0.1)',
                                          border: '1px solid rgba(59, 130, 246, 0.25)',
                                          color: '#60a5fa',
                                          padding: '2px 8px',
                                          borderRadius: '5px',
                                          fontSize: '0.74rem',
                                          fontFamily: 'monospace',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* 4. Member Join Position / Count ("Ethramathe member") Option Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: settings.welcome.showMemberCount !== false ? '14px' : '0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#38bdf8'
                                      }}>
                                        <Award size={18} />
                                      </div>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                                            Member Join Position / Count
                                          </h4>
                                          <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '700',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                            color: '#38bdf8',
                                            letterSpacing: '0.04em'
                                          }}>
                                            JOIN ORDER
                                          </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                          Displays member arrival count (e.g. "You are the 11th member to the server!") inside the container.
                                        </p>
                                      </div>
                                    </div>
                                    <label className="switch" style={{ scale: '0.85', flexShrink: 0 }}>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(settings.welcome.showMemberCount !== false)}
                                        onChange={() => handleToggle('welcome.showMemberCount')}
                                      />
                                      <span className="slider"></span>
                                    </label>
                                  </div>

                                  {settings.welcome.showMemberCount !== false && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                                      {/* Quick Format Presets */}
                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
                                            Quick Format Presets
                                          </label>
                                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Click to apply</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                          {[
                                            { label: '🏆 Ordinal (11th)', text: 'You are the {member_ordinal} member to the server!' },
                                            { label: '🔢 Numbered (#11)', text: 'Member #{member_count}' },
                                            { label: '🎉 Welcome + Ordinal', text: 'Welcome to {server}! You are our {member_ordinal} member!' }
                                          ].map((preset, pIdx) => (
                                            <button
                                              key={pIdx}
                                              type="button"
                                              onClick={() => handleInputChange('welcome.memberCountFormat', preset.text)}
                                              style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                color: '#cbd5e1',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                              }}
                                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#38bdf8'; }}
                                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#cbd5e1'; }}
                                            >
                                              {preset.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Format Template Input */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                                          Join Position Message Format
                                        </label>
                                        <input
                                          type="text"
                                          value={settings.welcome.memberCountFormat !== undefined ? settings.welcome.memberCountFormat : 'You are the {member_ordinal} member to the server!'}
                                          onChange={(e) => handleInputChange('welcome.memberCountFormat', e.target.value)}
                                          className="glass-input"
                                          placeholder="You are the {member_ordinal} member to the server!"
                                          style={{
                                            backgroundColor: '#07080e',
                                            borderColor: 'rgba(255, 255, 255, 0.08)',
                                            borderRadius: '8px',
                                            color: '#ffffff',
                                            padding: '10px 14px',
                                            fontSize: '0.88rem',
                                            width: '100%'
                                          }}
                                        />

                                        {/* Supported Tags for Join Position */}
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Insert tags:</span>
                                          {[
                                            { tag: '{member_ordinal}', desc: '11th' },
                                            { tag: '{member_count}', desc: '11' },
                                            { tag: '{member_number}', desc: '#11' },
                                            { tag: '{server}', desc: 'Server' }
                                          ].map(item => (
                                            <button
                                              key={item.tag}
                                              type="button"
                                              onClick={() => {
                                                const current = settings.welcome.memberCountFormat !== undefined ? settings.welcome.memberCountFormat : 'You are the {member_ordinal} member to the server!';
                                                handleInputChange('welcome.memberCountFormat', current + (current ? ' ' : '') + item.tag);
                                              }}
                                              style={{
                                                background: 'rgba(56, 189, 248, 0.1)',
                                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                                color: '#38bdf8',
                                                padding: '2px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.74rem',
                                                fontFamily: 'monospace',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              {item.tag} <span style={{ opacity: 0.6, fontSize: '0.68rem' }}>({item.desc})</span>
                                            </button>
                                          ))}
                                        </div>

                                        {/* Live Evaluation Preview */}
                                        <div style={{
                                          marginTop: '10px',
                                          padding: '8px 12px',
                                          backgroundColor: 'rgba(56, 189, 248, 0.06)',
                                          border: '1px dashed rgba(56, 189, 248, 0.25)',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          color: '#bae6fd',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}>
                                          <span style={{ fontWeight: '700', color: '#38bdf8' }}>✨ Live Preview:</span>
                                          <span>{formatWelcomeText(settings.welcome.memberCountFormat || 'You are the {member_ordinal} member to the server!')}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* 5. Time of Joining (Timestamp) Option Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(168, 85, 247, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#c084fc'
                                      }}>
                                        <Clock size={18} />
                                      </div>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                                            Time of Joining (Timestamp)
                                          </h4>
                                          <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '700',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(168, 85, 247, 0.15)',
                                            color: '#c084fc',
                                            letterSpacing: '0.04em'
                                          }}>
                                            DISCORD TIME
                                          </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                          Shows live timestamp (`🕒 Joined Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`) inside the container.
                                        </p>
                                      </div>
                                    </div>
                                    <label className="switch" style={{ scale: '0.85', flexShrink: 0 }}>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(settings.welcome.embedTimestamp !== false)}
                                        onChange={() => handleToggle('welcome.embedTimestamp')}
                                      />
                                      <span className="slider"></span>
                                    </label>
                                  </div>
                                </div>

                                {/* 6. Media Gallery (ComponentType.MEDIA_GALLERY, Type 12) */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Camera size={16} color="#34d399" />
                                        ComponentType.MEDIA_GALLERY (Type 12)
                                      </h4>
                                      <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                                        Multi-image responsive gallery grid ({((settings.welcome.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0) ? settings.welcome.mediaGalleryItems : defaultWebcamItems).length} / 10 items)
                                      </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        onClick={handleLoadWebcamPreset}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                          border: '1px solid rgba(56, 189, 248, 0.25)',
                                          color: '#38bdf8',
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Camera size={13} />
                                        <span>📸 Load Webcam Preset</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={handleAddMediaGalleryItem}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                          border: '1px solid rgba(16, 185, 129, 0.35)',
                                          color: '#34d399',
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Plus size={14} />
                                        <span>+ Add Image</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Hidden file input for uploading gallery images */}
                                  <input
                                    type="file"
                                    ref={galleryFileInputRef}
                                    onChange={(e) => {
                                      if (uploadingGalleryIdx !== null) {
                                        handleGalleryImageUpload(e, uploadingGalleryIdx);
                                      }
                                    }}
                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                    style={{ display: 'none' }}
                                  />

                                  {/* List of Media Gallery Items */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {((settings.welcome.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0) ? settings.welcome.mediaGalleryItems : defaultWebcamItems).map((item, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          backgroundColor: '#07080e',
                                          border: '1px solid rgba(255, 255, 255, 0.08)',
                                          borderRadius: '10px',
                                          padding: '12px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '10px'
                                        }}
                                      >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                              backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                              color: '#38bdf8',
                                              fontSize: '0.7rem',
                                              fontWeight: '700',
                                              padding: '2px 8px',
                                              borderRadius: '4px'
                                            }}>
                                              #{idx + 1}
                                            </span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#e2e8f0' }}>
                                              Gallery Item #{idx + 1}
                                            </span>
                                          </div>

                                          <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setUploadingGalleryIdx(idx);
                                                galleryFileInputRef.current?.click();
                                              }}
                                              disabled={uploadingGalleryIdx === idx}
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                                                border: '1px solid rgba(59, 130, 246, 0.25)',
                                                color: '#60a5fa',
                                                padding: '4px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.74rem',
                                                cursor: uploadingGalleryIdx === idx ? 'not-allowed' : 'pointer'
                                              }}
                                            >
                                              {uploadingGalleryIdx === idx ? (
                                                <RotateCw size={12} className="spin-animation" />
                                              ) : (
                                                <UploadCloud size={12} />
                                              )}
                                              <span>Upload</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleRemoveMediaGalleryItem(idx)}
                                              title="Remove this media item"
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                                color: '#f87171',
                                                padding: '4px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.74rem',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </div>

                                        {/* URL Input */}
                                        <div>
                                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                            Media URL (WebP, PNG, JPG, GIF)
                                          </label>
                                          <input
                                            type="text"
                                            value={item.url || ''}
                                            onChange={(e) => handleUpdateMediaGalleryItem(idx, 'url', e.target.value)}
                                            placeholder="https://... or click Upload"
                                            className="glass-input"
                                            style={{
                                              backgroundColor: '#0a0c16',
                                              borderColor: 'rgba(255, 255, 255, 0.08)',
                                              borderRadius: '6px',
                                              color: '#ffffff',
                                              padding: '8px 12px',
                                              fontSize: '0.82rem',
                                              fontFamily: 'monospace'
                                            }}
                                          />
                                        </div>

                                        {/* Description / Alt text Input */}
                                        <div>
                                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                            Description (Discord Alt Text & Hover Tooltip)
                                          </label>
                                          <textarea
                                            value={item.description || ''}
                                            onChange={(e) => handleUpdateMediaGalleryItem(idx, 'description', e.target.value)}
                                            placeholder="Description of the media item..."
                                            rows="2"
                                            className="glass-input"
                                            style={{
                                              backgroundColor: '#0a0c16',
                                              borderColor: 'rgba(255, 255, 255, 0.08)',
                                              borderRadius: '6px',
                                              color: '#ffffff',
                                              padding: '8px 12px',
                                              fontSize: '0.82rem',
                                              resize: 'vertical'
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* 7. Action Row & Quick Links INSIDE the Container */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px'
                                }}>
                                  <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <LinkIcon size={16} color="#a78bfa" />
                                      Interactive Action Buttons (Inside Container)
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                      These buttons are placed directly <strong>INSIDE</strong> the V2 container (Type 17) separated by a Discord separator (Type 14).
                                    </p>
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Server Website URL (Optional)</label>
                                    <input
                                      type="text"
                                      value={settings.welcome.websiteUrl || ''}
                                      onChange={(e) => handleInputChange('welcome.websiteUrl', e.target.value)}
                                      className="glass-input"
                                      placeholder="https://yourwebsite.com"
                                      style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                    />
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Channel Quick-Link 1</label>
                                      <select
                                        value={settings.welcome.redirectChannelId || ''}
                                        onChange={(e) => handleInputChange('welcome.redirectChannelId', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="">-- No Button --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Channel Quick-Link 2</label>
                                      <select
                                        value={settings.welcome.redirectChannelId2 || ''}
                                        onChange={(e) => handleInputChange('welcome.redirectChannelId2', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="">-- No Button --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Channel Quick-Link 3</label>
                                      <select
                                        value={settings.welcome.redirectChannelId3 || ''}
                                        onChange={(e) => handleInputChange('welcome.redirectChannelId3', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="">-- No Button --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                {/* 8. Container Footer Subtext & Icon Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} color="#94a3b8" />
                                    Container Footer Subtext & Icon (Optional)
                                  </h4>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Footer Text</label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedFooterText || ''}
                                        onChange={(e) => handleInputChange('welcome.embedFooterText', e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Server Rules • Enjoy your stay!"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Footer Icon URL</label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedFooterIcon || ''}
                                        onChange={(e) => handleInputChange('welcome.embedFooterIcon', e.target.value)}
                                        className="glass-input"
                                        placeholder="https://..."
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 9. Live Actions & JSON Inspector */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: '10px',
                                  padding: '12px',
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px'
                                }}>
                                  <button
                                    type="button"
                                    onClick={() => setShowV2JsonModal(true)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                      border: '1px solid rgba(255, 255, 255, 0.12)',
                                      color: '#cbd5e1',
                                      padding: '8px 14px',
                                      borderRadius: '7px',
                                      fontSize: '0.82rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Code size={14} color="#38bdf8" />
                                    <span>📋 View Discord V2 Payload JSON</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleSendTestWelcome}
                                    disabled={testingWelcomeMessage}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                      border: '1px solid rgba(16, 185, 129, 0.35)',
                                      color: '#34d399',
                                      padding: '8px 14px',
                                      borderRadius: '7px',
                                      fontSize: '0.82rem',
                                      fontWeight: '600',
                                      cursor: testingWelcomeMessage ? 'not-allowed' : 'pointer'
                                    }}
                                  >
                                    {testingWelcomeMessage ? (
                                      <>
                                        <RotateCw size={14} className="spin-animation" />
                                        <span>Sending Test...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Send size={14} />
                                        <span>Send Test Welcome Message</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Greeting Channel & Sidebar Accent Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                  {/* Greeting Channel */}
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                                      Greeting Channel
                                    </label>
                                    <select
                                      value={settings.welcome.channelId || ''}
                                      onChange={(e) => handleInputChange('welcome.channelId', e.target.value)}
                                      className="glass-input"
                                      style={{
                                        backgroundColor: '#0c0e17',
                                        borderColor: 'rgba(255,255,255,0.08)',
                                        borderRadius: '8px',
                                        padding: '10px 14px',
                                        color: '#ffffff'
                                      }}
                                    >
                                      <option value="">-- Select Greeting Channel --</option>
                                      {channels.map(ch => (
                                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Sidebar Accent */}
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                      <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>
                                        Sidebar Accent
                                      </label>
                                      <label className="switch" style={{ scale: '0.85' }}>
                                        <input
                                          type="checkbox"
                                          checked={settings.welcome.sidebarAccentEnabled !== false}
                                          onChange={(e) => handleInputChange('welcome.sidebarAccentEnabled', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                      </label>
                                    </div>

                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      backgroundColor: '#0c0e17',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      borderRadius: '8px',
                                      padding: '6px 12px',
                                      height: '42px'
                                    }}>
                                      <input
                                        type="color"
                                        value={settings.welcome.embedColor?.startsWith('#') ? settings.welcome.embedColor : `#${settings.welcome.embedColor || 'ffffff'}`}
                                        onChange={(e) => handleInputChange('welcome.embedColor', e.target.value)}
                                        style={{
                                          width: '28px',
                                          height: '28px',
                                          padding: 0,
                                          border: 'none',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          background: 'none'
                                        }}
                                      />
                                      <input
                                        type="text"
                                        value={settings.welcome.embedColor || '#ffffff'}
                                        onChange={(e) => handleInputChange('welcome.embedColor', e.target.value)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#ffffff',
                                          fontSize: '0.9rem',
                                          fontFamily: 'monospace',
                                          outline: 'none',
                                          width: '100%'
                                        }}
                                        placeholder="#ffffff"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Embed Header Title & Thumbnail Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles size={16} color="#60a5fa" />
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                                      Embed Header Title & Thumbnail
                                    </h4>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Embed Title (Optional)</label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedTitle || ''}
                                        onChange={(e) => handleInputChange('welcome.embedTitle', e.target.value)}
                                        className="glass-input"
                                        placeholder="Welcome to {server}!"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Embed Thumbnail</label>
                                      <select
                                        value={settings.welcome.embedThumbnail || '{user_avatar}'}
                                        onChange={(e) => handleInputChange('welcome.embedThumbnail', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="{user_avatar}">👤 Member Avatar (Default)</option>
                                        <option value="{server_icon}">🏰 Server Icon</option>
                                        <option value="none">❌ Disabled (No Thumbnail)</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                {/* Custom Welcome Message Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', marginBottom: '12px' }}>
                                    Custom Welcome Message
                                  </h4>
                                  <textarea
                                    value={settings.welcome.message || ''}
                                    onChange={(e) => handleInputChange('welcome.message', e.target.value)}
                                    className="glass-input"
                                    placeholder="Welcome {user} to {server}!"
                                    rows="3"
                                    style={{
                                      backgroundColor: '#07080e',
                                      borderColor: 'rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      color: '#ffffff',
                                      minHeight: '85px',
                                      resize: 'vertical',
                                      fontFamily: 'inherit',
                                      fontSize: '0.9rem',
                                      padding: '10px 14px'
                                    }}
                                  />

                                  {/* Supported tags chips */}
                                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Supported tags:</span>
                                    {['{user}', '{username}', '{server}', '{channel}', '{channel2}', '{channel3}', '{member_ordinal}', '{member_count}', '{member_number}'].map((tag) => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                          const currentMsg = settings.welcome.message || '';
                                          handleInputChange('welcome.message', currentMsg + (currentMsg ? ' ' : '') + tag);
                                        }}
                                        style={{
                                          background: 'rgba(59, 130, 246, 0.1)',
                                          border: '1px solid rgba(59, 130, 246, 0.25)',
                                          color: '#60a5fa',
                                          padding: '3px 10px',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          fontFamily: 'monospace',
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Member Join Position / Count (Ethramathe Member) Option Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: settings.welcome.showMemberCount ? '14px' : '0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#38bdf8'
                                      }}>
                                        <Award size={18} />
                                      </div>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                                            Member Join Position / Count
                                          </h4>
                                          <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '700',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                            color: '#38bdf8',
                                            letterSpacing: '0.04em'
                                          }}>
                                            JOIN ORDER
                                          </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                                          Display what number member they are when joining (e.g. "You are the 11th member to the server!").
                                        </p>
                                      </div>
                                    </div>
                                    <label className="switch" style={{ scale: '0.85', flexShrink: 0 }}>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(settings.welcome.showMemberCount)}
                                        onChange={() => handleToggle('welcome.showMemberCount')}
                                      />
                                      <span className="slider"></span>
                                    </label>
                                  </div>

                                  {settings.welcome.showMemberCount && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                                      {/* Placement Selector */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
                                          Display Placement
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                                          {[
                                            { id: 'message', label: 'Append to Message', desc: 'Adds note to welcome message' },
                                            { id: 'footer', label: 'Embed Footer', desc: 'Displays in embed footer' },
                                            { id: 'custom', label: 'Custom Tag Only', desc: 'Use {member_ordinal} anywhere' }
                                          ].map(opt => {
                                            const isSelected = (settings.welcome.memberCountPlacement || 'message') === opt.id;
                                            return (
                                              <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleInputChange('welcome.memberCountPlacement', opt.id)}
                                                style={{
                                                  padding: '8px 10px',
                                                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#07080e',
                                                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                                                  borderRadius: '8px',
                                                  color: isSelected ? '#38bdf8' : '#94a3b8',
                                                  fontSize: '0.8rem',
                                                  fontWeight: isSelected ? '600' : '500',
                                                  cursor: 'pointer',
                                                  textAlign: 'left',
                                                  transition: 'all 0.15s ease'
                                                }}
                                              >
                                                <div>{opt.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: isSelected ? '#7dd3fc' : '#64748b', marginTop: '2px' }}>{opt.desc}</div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Quick Format Presets */}
                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
                                            Quick Format Presets
                                          </label>
                                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Click to apply</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                          {[
                                            { label: '🏆 Ordinal (11th)', text: 'You are the {member_ordinal} member to the server!' },
                                            { label: '🔢 Numbered (#11)', text: 'Member #{member_count}' },
                                            { label: '🎉 Welcome + Ordinal', text: 'Welcome to {server}! You are our {member_ordinal} member!' }
                                          ].map((preset, pIdx) => (
                                            <button
                                              key={pIdx}
                                              type="button"
                                              onClick={() => handleInputChange('welcome.memberCountFormat', preset.text)}
                                              style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                color: '#cbd5e1',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                              }}
                                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#38bdf8'; }}
                                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#cbd5e1'; }}
                                            >
                                              {preset.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Format Template Input */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
                                          Join Position Message Format
                                        </label>
                                        <input
                                          type="text"
                                          value={settings.welcome.memberCountFormat !== undefined ? settings.welcome.memberCountFormat : 'You are the {member_ordinal} member to the server!'}
                                          onChange={(e) => handleInputChange('welcome.memberCountFormat', e.target.value)}
                                          className="glass-input"
                                          placeholder="You are the {member_ordinal} member to the server!"
                                          style={{
                                            backgroundColor: '#07080e',
                                            borderColor: 'rgba(255, 255, 255, 0.08)',
                                            borderRadius: '8px',
                                            color: '#ffffff',
                                            padding: '10px 14px',
                                            fontSize: '0.88rem',
                                            width: '100%'
                                          }}
                                        />

                                        {/* Supported Tags for Join Position */}
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Insert tags:</span>
                                          {[
                                            { tag: '{member_ordinal}', desc: '11th' },
                                            { tag: '{member_count}', desc: '11' },
                                            { tag: '{member_number}', desc: '#11' },
                                            { tag: '{server}', desc: 'Server' }
                                          ].map(item => (
                                            <button
                                              key={item.tag}
                                              type="button"
                                              onClick={() => {
                                                const current = settings.welcome.memberCountFormat !== undefined ? settings.welcome.memberCountFormat : 'You are the {member_ordinal} member to the server!';
                                                handleInputChange('welcome.memberCountFormat', current + (current ? ' ' : '') + item.tag);
                                              }}
                                              style={{
                                                background: 'rgba(56, 189, 248, 0.1)',
                                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                                color: '#38bdf8',
                                                padding: '2px 8px',
                                                borderRadius: '5px',
                                                fontSize: '0.74rem',
                                                fontFamily: 'monospace',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              {item.tag} <span style={{ opacity: 0.6, fontSize: '0.68rem' }}>({item.desc})</span>
                                            </button>
                                          ))}
                                        </div>

                                        {/* Live Evaluation Preview */}
                                        <div style={{
                                          marginTop: '10px',
                                          padding: '8px 12px',
                                          backgroundColor: 'rgba(56, 189, 248, 0.06)',
                                          border: '1px dashed rgba(56, 189, 248, 0.25)',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          color: '#bae6fd',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}>
                                          <span style={{ fontWeight: '700', color: '#38bdf8' }}>✨ Live Preview:</span>
                                          <span>{formatWelcomeText(settings.welcome.memberCountFormat || 'You are the {member_ordinal} member to the server!')}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Welcome Banner Image / GIF Link Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <ImageIcon size={16} color="#60a5fa" />
                                      Welcome Banner Image / GIF
                                    </h4>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <input
                                        type="file"
                                        ref={welcomeBannerFileRef}
                                        onChange={handleWelcomeFileUpload}
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                        style={{ display: 'none' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => welcomeBannerFileRef.current?.click()}
                                        disabled={uploadingWelcomeBanner}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                          border: '1px solid rgba(59, 130, 246, 0.35)',
                                          color: '#60a5fa',
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          fontSize: '0.8rem',
                                          fontWeight: '600',
                                          cursor: uploadingWelcomeBanner ? 'not-allowed' : 'pointer',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        {uploadingWelcomeBanner ? (
                                          <>
                                            <RotateCw size={14} className="spin-animation" />
                                            <span>Uploading...</span>
                                          </>
                                        ) : (
                                          <>
                                            <UploadCloud size={14} />
                                            <span>Upload Image / GIF</span>
                                          </>
                                        )}
                                      </button>

                                      {settings.welcome.background && (
                                        <button
                                          type="button"
                                          onClick={() => handleInputChange('welcome.background', '')}
                                          title="Remove custom banner"
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                            border: '1px solid rgba(239, 68, 68, 0.25)',
                                            color: '#f87171',
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          <Trash2 size={14} />
                                          <span>Clear</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      value={settings.welcome.background || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleInputChange('welcome.background', val);
                                        if (val && (val.toLowerCase().includes('.gif') || val.includes('tenor') || val.includes('giphy'))) {
                                          handleInputChange('welcome.gifSupport', true);
                                        }
                                      }}
                                      className="glass-input"
                                      placeholder="Paste image link, GIF link, Tenor URL or click Upload"
                                      style={{
                                        backgroundColor: '#07080e',
                                        borderColor: 'rgba(255, 255, 255, 0.08)',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        padding: '10px 14px',
                                        fontSize: '0.88rem',
                                        flex: 1
                                      }}
                                    />
                                  </div>

                                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <input
                                        type="checkbox"
                                        id="enableGifSupportCheck"
                                        checked={Boolean(settings.welcome.gifSupport)}
                                        onChange={() => handleToggle('welcome.gifSupport')}
                                        style={{ cursor: 'pointer', accentColor: '#2563eb' }}
                                      />
                                      <label htmlFor="enableGifSupportCheck" style={{ fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' }}>
                                        Enable Animated GIF Display in Embed
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={handleSendTestWelcome}
                                      disabled={testingWelcomeMessage}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                        border: '1px solid rgba(16, 185, 129, 0.35)',
                                        color: '#34d399',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: testingWelcomeMessage ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {testingWelcomeMessage ? (
                                        <>
                                          <RotateCw size={14} className="spin-animation" />
                                          <span>Sending Test...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Send size={14} />
                                          <span>Send Test Welcome Message</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Server Website URL Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', marginBottom: '12px' }}>
                                    Server Website URL (Optional)
                                  </h4>
                                  <input
                                    type="text"
                                    value={settings.welcome.websiteUrl || ''}
                                    onChange={(e) => handleInputChange('welcome.websiteUrl', e.target.value)}
                                    className="glass-input"
                                    placeholder="https://yourwebsite.com"
                                    style={{
                                      backgroundColor: '#07080e',
                                      borderColor: 'rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      color: '#ffffff',
                                      padding: '10px 14px',
                                      fontSize: '0.88rem'
                                    }}
                                  />
                                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '6px 0 0 0' }}>
                                    Add your server's website link. An interactive "🌐 Website" button will be included in the welcome message.
                                  </p>
                                </div>

                                {/* Channel Quick-Link Buttons (Action Row) Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', marginBottom: '12px' }}>
                                    Channel Quick-Link Buttons (Action Row)
                                  </h4>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '12px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>Button Link 1</label>
                                      <select
                                        value={settings.welcome.redirectChannelId || ''}
                                        onChange={(e) => handleInputChange('welcome.redirectChannelId', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="">-- No Button --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>Button Link 2</label>
                                      <select
                                        value={settings.welcome.redirectChannelId2 || ''}
                                        onChange={(e) => handleInputChange('welcome.redirectChannelId2', e.target.value)}
                                        className="glass-input"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      >
                                        <option value="">-- No Button --</option>
                                        {channels.map(ch => (
                                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div style={{ width: 'calc(50% - 7px)' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>Button Link 3</label>
                                    <select
                                      value={settings.welcome.redirectChannelId3 || ''}
                                      onChange={(e) => handleInputChange('welcome.redirectChannelId3', e.target.value)}
                                      className="glass-input"
                                      style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                    >
                                      <option value="">-- No Button --</option>
                                      {channels.map(ch => (
                                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Embed Footer & Timestamp Box */}
                                <div style={{
                                  backgroundColor: '#0a0c16',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} color="#94a3b8" />
                                    Embed Footer & Timestamp (Optional)
                                  </h4>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Footer Text</label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedFooterText || ''}
                                        onChange={(e) => handleInputChange('welcome.embedFooterText', e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Server Rules • Enjoy your stay!"
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Footer Icon URL</label>
                                      <input
                                        type="text"
                                        value={settings.welcome.embedFooterIcon || ''}
                                        onChange={(e) => handleInputChange('welcome.embedFooterIcon', e.target.value)}
                                        className="glass-input"
                                        placeholder="https://..."
                                        style={{ backgroundColor: '#07080e', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem' }}
                                      />
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' }}>
                                      Show Joining Timestamp
                                    </label>
                                    <label className="switch" style={{ scale: '0.8' }}>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(settings.welcome.embedTimestamp !== false)}
                                        onChange={() => handleToggle('welcome.embedTimestamp')}
                                      />
                                      <span className="slider"></span>
                                    </label>
                                  </div>
                                </div>
                              </>
                            )}

                          </div>

                          {/* RIGHT COLUMN: Live Discord Message Preview matching screenshot */}
                          <div className="welcome-preview-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                            {/* Live Preview Header with Mode Toggle Switcher */}
                            {(() => {
                              const isContainerPreview = welcomePreviewMode === 'container' || (welcomePreviewMode === 'auto' && settings.welcome.layoutType === 'container');
                              const galleryItems = (settings.welcome.mediaGalleryItems && settings.welcome.mediaGalleryItems.length > 0)
                                ? settings.welcome.mediaGalleryItems
                                : defaultWebcamItems;

                              return (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      <Eye size={14} />
                                      <span>LIVE DISCORD MESSAGE PREVIEW</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#07080e', padding: '3px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                      <button
                                        type="button"
                                        onClick={() => setWelcomePreviewMode('auto')}
                                        style={{
                                          backgroundColor: welcomePreviewMode === 'auto' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                                          color: welcomePreviewMode === 'auto' ? '#38bdf8' : '#64748b',
                                          border: 'none',
                                          padding: '3px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.72rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Auto
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setWelcomePreviewMode('container')}
                                        style={{
                                          backgroundColor: welcomePreviewMode === 'container' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                          color: welcomePreviewMode === 'container' ? '#34d399' : '#64748b',
                                          border: 'none',
                                          padding: '3px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.72rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        ✨ V2 Container
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setWelcomePreviewMode('classic')}
                                        style={{
                                          backgroundColor: welcomePreviewMode === 'classic' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                          color: welcomePreviewMode === 'classic' ? '#60a5fa' : '#64748b',
                                          border: 'none',
                                          padding: '3px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.72rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        🖼️ Classic Embed
                                      </button>
                                    </div>
                                  </div>

                                  {/* Discord Channel Bar */}
                                  <div style={{
                                    backgroundColor: '#2b2d31',
                                    borderRadius: '8px 8px 0 0',
                                    padding: '10px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    borderBottom: '1px solid rgba(0,0,0,0.2)'
                                  }}>
                                    <span style={{ color: '#80848e', fontSize: '1.1rem', fontWeight: '700' }}>#</span>
                                    <span style={{ color: '#f2f3f5', fontWeight: '600', fontSize: '0.9rem' }}>
                                      {channels.find(c => c.id === settings.welcome.channelId)?.name || 'welcome'}
                                    </span>
                                    <span style={{ color: '#4e5058', margin: '0 4px' }}>|</span>
                                    <span style={{ color: '#949ba4', fontSize: '0.8rem' }}>Greeting channel preview</span>
                                  </div>

                                  {/* Discord Message Area */}
                                  <div style={{
                                    backgroundColor: '#313338',
                                    borderRadius: '0 0 8px 8px',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                  }}>
                                    <div style={{ display: 'flex', gap: '14px' }}>
                                      {/* Bot Avatar */}
                                      <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#111214',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                      }}>
                                        <img
                                          src={guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                          alt="bot avatar"
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                      </div>

                                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {/* Bot Name & Badge */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ color: '#f2f3f5', fontWeight: '600', fontSize: '0.95rem' }}>
                                            BrickGuard
                                          </span>
                                          <span style={{
                                            backgroundColor: '#5865f2',
                                            color: '#ffffff',
                                            fontSize: '0.65rem',
                                            fontWeight: '700',
                                            padding: '1px 5px',
                                            borderRadius: '3px',
                                            letterSpacing: '0.02em'
                                          }}>
                                            BOT
                                          </span>
                                          <span style={{ color: '#949ba4', fontSize: '0.75rem' }}>
                                            Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>

                                        {/* View Selection: Components V2 Container vs Classic Embed */}
                                        {isContainerPreview ? (
                                          /* --- V2 CONTAINER / MEDIA GALLERY (flags: 32768) PREVIEW --- */
                                          <div style={{
                                            backgroundColor: '#2b2d31',
                                            borderLeft: settings.welcome.containerWrap
                                              ? `4px solid ${settings.welcome.containerAccentColor || '#2563eb'}`
                                              : 'none',
                                            borderRadius: '6px',
                                            padding: '14px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            marginTop: '4px',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                            maxWidth: '520px'
                                          }}>
                                            {/* V2 Header Tag */}
                                            <div style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              paddingBottom: '8px',
                                              borderBottom: '1px solid rgba(255,255,255,0.06)',
                                              fontSize: '0.68rem',
                                              color: '#94a3b8',
                                              fontWeight: '700'
                                            }}>
                                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: settings.welcome.containerAccentColor || '#2563eb' }} />
                                                {settings.welcome.containerWrap ? 'CONTAINER (type: 17)' : 'TOP-LEVEL COMPONENTS'}
                                              </span>
                                              <span style={{ opacity: 0.7, fontFamily: 'monospace' }}>flags: 32768</span>
                                            </div>

                                            {/* ComponentType.SECTION (Type 9) with Title & Member Avatar Thumbnail Accessory */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                              <div style={{ flex: 1 }}>
                                                {settings.welcome.embedTitle && settings.welcome.embedTitle.trim() ? (
                                                  <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.05rem', marginBottom: '6px' }}>
                                                    {formatWelcomeText(settings.welcome.embedTitle)}
                                                  </div>
                                                ) : null}
                                                <div style={{ color: '#dbdee1', fontSize: '0.92rem', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                  {formatWelcomeText(settings.welcome.textDisplayContent || settings.welcome.message || 'Live webcam shots as of 18-04-2025 at 12:00 UTC')}
                                                </div>
                                              </div>

                                              {/* Top-Right Thumbnail Accessory (Type 11) */}
                                              {settings.welcome.embedThumbnail !== 'none' && (
                                                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#111214' }}>
                                                  <img
                                                    src={
                                                      settings.welcome.embedThumbnail === '{server_icon}'
                                                        ? (guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png')
                                                        : (user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : (guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png'))
                                                    }
                                                    alt="thumbnail accessory"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                  />
                                                  <span style={{
                                                    position: 'absolute',
                                                    bottom: '2px',
                                                    right: '2px',
                                                    backgroundColor: 'rgba(0,0,0,0.85)',
                                                    color: '#ffffff',
                                                    fontSize: '0.55rem',
                                                    fontWeight: '700',
                                                    padding: '1px 3px',
                                                    borderRadius: '2px'
                                                  }}>
                                                    ALT
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            {/* Member Join Position / Count Callout Badge (Type 10) */}
                                            {settings.welcome.showMemberCount !== false && (
                                              <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                                borderRadius: '6px',
                                                padding: '5px 10px',
                                                color: '#38bdf8',
                                                fontSize: '0.84rem',
                                                fontWeight: '500',
                                                alignSelf: 'flex-start'
                                              }}>
                                                <span>🎉</span>
                                                <span>{formatWelcomeText(settings.welcome.memberCountFormat || 'You are the {member_ordinal} member to the server!')}</span>
                                              </div>
                                            )}

                                            {/* Time of Joining (Timestamp) (Type 10) */}
                                            {settings.welcome.embedTimestamp !== false && (
                                              <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.74rem',
                                                color: '#94a3b8',
                                                marginTop: '-4px'
                                              }}>
                                                <span>🕒</span>
                                                <span>Joined Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Just now)</span>
                                              </div>
                                            )}

                                            {/* ComponentType.MEDIA_GALLERY (Type 12) Grid */}
                                            {galleryItems.length > 0 && (
                                              <div style={{ marginTop: '2px' }}>
                                                {galleryItems.length === 1 && (
                                                  <div style={{ position: 'relative', width: '100%', maxHeight: '280px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#111214' }}>
                                                    <img
                                                      src={resolveUploadUrl(galleryItems[0]?.url || galleryItems[0]?.media?.url)}
                                                      alt={galleryItems[0]?.description || 'webcam 1'}
                                                      style={{ width: '100%', height: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
                                                    />
                                                    {galleryItems[0]?.description && (
                                                      <span title={galleryItems[0].description} style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}>
                                                        ALT
                                                      </span>
                                                    )}
                                                  </div>
                                                )}

                                                {galleryItems.length === 2 && (
                                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', borderRadius: '8px', overflow: 'hidden', height: '190px', backgroundColor: '#111214' }}>
                                                    {galleryItems.slice(0, 2).map((itm, idx) => (
                                                      <div key={idx} style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                                                        <img
                                                          src={resolveUploadUrl(itm?.url || itm?.media?.url)}
                                                          alt={itm?.description || `Gallery image ${idx + 1}`}
                                                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                        />
                                                        {itm?.description && (
                                                          <span title={itm.description} style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.62rem', fontWeight: '800', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer' }}>
                                                            ALT
                                                          </span>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}

                                                {galleryItems.length === 3 && (
                                                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4px', borderRadius: '8px', overflow: 'hidden', height: '240px', backgroundColor: '#111214' }}>
                                                    {/* Big Left Image (webcam 1) */}
                                                    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                                                      <img
                                                        src={resolveUploadUrl(galleryItems[0]?.url || galleryItems[0]?.media?.url)}
                                                        alt={galleryItems[0]?.description || 'webcam 1'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                      />
                                                      {galleryItems[0]?.description && (
                                                        <span title={galleryItems[0].description} style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.62rem', fontWeight: '800', padding: '2px 5px', borderRadius: '3px', cursor: 'pointer' }}>
                                                          ALT
                                                        </span>
                                                      )}
                                                    </div>

                                                    {/* Stacked Right Images (webcam 2 & webcam 3) */}
                                                    <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '4px', height: '100%' }}>
                                                      {[galleryItems[1], galleryItems[2]].map((itm, idx) => (
                                                        <div key={idx} style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                                                          <img
                                                            src={resolveUploadUrl(itm?.url || itm?.media?.url)}
                                                            alt={itm?.description || `webcam ${idx + 2}`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                          />
                                                          {itm?.description && (
                                                            <span title={itm.description} style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.58rem', fontWeight: '800', padding: '1px 4px', borderRadius: '3px', cursor: 'pointer' }}>
                                                              ALT
                                                            </span>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {galleryItems.length >= 4 && (
                                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', borderRadius: '8px', overflow: 'hidden', height: '240px', backgroundColor: '#111214' }}>
                                                    {galleryItems.slice(0, 4).map((itm, idx) => (
                                                      <div key={idx} style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                                                        <img
                                                          src={resolveUploadUrl(itm?.url || itm?.media?.url)}
                                                          alt={itm?.description || `Gallery image ${idx + 1}`}
                                                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                        />
                                                        {itm?.description && (
                                                          <span title={itm.description} style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.58rem', fontWeight: '800', padding: '1px 4px', borderRadius: '3px', cursor: 'pointer' }}>
                                                            ALT
                                                          </span>
                                                        )}
                                                        {idx === 3 && galleryItems.length > 4 && (
                                                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '700', fontSize: '1.1rem' }}>
                                                            +{galleryItems.length - 4}
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {/* Channel Quick-Link Buttons inside V2 Container (Type 14 separator + buttons) */}
                                            {renderRedirectButton() && (
                                              <>
                                                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '6px 0 2px 0' }} />
                                                <div style={{ marginTop: '2px' }}>
                                                  {renderRedirectButton()}
                                                </div>
                                              </>
                                            )}

                                            {/* Container Footer Subtext & Icon (Type 10) */}
                                            {(settings.welcome.embedFooterText || settings.welcome.embedFooterIcon) && (
                                              <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                paddingTop: '8px',
                                                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                                fontSize: '0.74rem',
                                                color: '#949ba4'
                                              }}>
                                                {settings.welcome.embedFooterIcon && (
                                                  <img
                                                    src={resolveUploadUrl(settings.welcome.embedFooterIcon)}
                                                    alt="footer icon"
                                                    style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                                                  />
                                                )}
                                                <span>{formatWelcomeText(settings.welcome.embedFooterText)}</span>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          /* --- CLASSIC EMBED CONTAINER --- */
                                          <div style={{
                                            backgroundColor: '#2b2d31',
                                            borderLeft: (settings.welcome.sidebarAccentEnabled !== false)
                                              ? `4px solid ${settings.welcome.embedColor || '#ffffff'}`
                                              : 'none',
                                            borderRadius: '4px',
                                            padding: '16px',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            marginTop: '4px'
                                          }}>
                                            {/* Embed Header Row: Title & Top-Right Thumbnail */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                                              <div style={{ flex: 1 }}>
                                                {settings.welcome.embedTitle && settings.welcome.embedTitle.trim() ? (
                                                  <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem', marginBottom: '6px' }}>
                                                    {formatWelcomeText(settings.welcome.embedTitle)}
                                                  </div>
                                                ) : null}

                                                <div style={{ color: '#dbdee1', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                  {formatWelcomeText(settings.welcome.message || 'Welcome {user} to {server}!')}
                                                </div>
                                                {settings.welcome.showMemberCount && (settings.welcome.memberCountPlacement || 'message') === 'message' && !(/\{member_ordinal\}|\{memberordinal\}|\{ordinal\}|\{member_count\}|\{membercount\}|\{member_number\}|\{membernumber\}/i.test(settings.welcome.message || '')) && (
                                                  <div style={{
                                                    marginTop: '8px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                                    border: '1px solid rgba(56, 189, 248, 0.25)',
                                                    borderRadius: '6px',
                                                    padding: '4px 10px',
                                                    color: '#38bdf8',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                  }}>
                                                    <span>🎉</span>
                                                    <span>{formatWelcomeText(settings.welcome.memberCountFormat || 'You are the {member_ordinal} member to the server!')}</span>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Thumbnail with ALT badge */}
                                              <div style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                                <img
                                                  src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                                  alt="thumbnail preview"
                                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <span style={{
                                                  position: 'absolute',
                                                  bottom: '2px',
                                                  right: '2px',
                                                  backgroundColor: 'rgba(0,0,0,0.85)',
                                                  color: '#ffffff',
                                                  fontSize: '0.55rem',
                                                  fontWeight: '700',
                                                  padding: '1px 3px',
                                                  borderRadius: '2px'
                                                }}>
                                                  ALT
                                                </span>
                                              </div>
                                            </div>

                                            {/* Welcome Canvas Card / Banner Image Display */}
                                            <div style={{
                                              position: 'relative',
                                              width: '100%',
                                              minHeight: '220px',
                                              borderRadius: '6px',
                                              backgroundColor: '#111214',
                                              overflow: 'hidden',
                                              border: '1px solid rgba(255,255,255,0.05)',
                                              marginTop: '4px'
                                            }}>
                                              {settings.welcome.background && (settings.welcome.background.startsWith('http') || settings.welcome.background.startsWith('/uploads/')) ? (
                                                <img
                                                  src={resolveUploadUrl(settings.welcome.background)}
                                                  alt="welcome banner preview"
                                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                              ) : (
                                                renderCanvasCard()
                                              )}

                                              <span style={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                left: '8px',
                                                backgroundColor: 'rgba(0,0,0,0.85)',
                                                color: '#ffffff',
                                                fontSize: '0.65rem',
                                                fontWeight: '700',
                                                padding: '2px 6px',
                                                borderRadius: '3px'
                                              }}>
                                                ALT
                                              </span>
                                            </div>

                                            {/* Channel Quick-Link Buttons inside Container with Separator (V2 Layout) */}
                                            {renderRedirectButton() && (
                                              <>
                                                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '4px 0 2px 0' }} />
                                                {renderRedirectButton()}
                                              </>
                                            )}

                                            {/* Embed Footer with Member Join Position Preview */}
                                            {(settings.welcome.embedFooterText || (settings.welcome.showMemberCount && settings.welcome.memberCountPlacement === 'footer')) && (
                                              <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                marginTop: '6px',
                                                paddingTop: '6px',
                                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                                fontSize: '0.75rem',
                                                color: '#949ba4'
                                              }}>
                                                {settings.welcome.embedFooterIcon && (
                                                  <img
                                                    src={resolveUploadUrl(settings.welcome.embedFooterIcon)}
                                                    alt="footer icon"
                                                    style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                                                  />
                                                )}
                                                <span>
                                                  {[
                                                    settings.welcome.embedFooterText ? formatWelcomeText(settings.welcome.embedFooterText) : null,
                                                    (settings.welcome.showMemberCount && settings.welcome.memberCountPlacement === 'footer')
                                                      ? formatWelcomeText(settings.welcome.memberCountFormat || 'You are the {member_ordinal} member to the server!')
                                                      : null
                                                  ].filter(Boolean).join(' • ')}
                                                </span>
                                              </div>
                                            )}

                                          </div>
                                        )}

                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}

                          </div>

                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}





              {/* TAB 4: VERIFICATION */}
              {activeTab === 'verification' && (
                <div>

                  <div className="preview-layout-container">
                    {/* Left Column: Form Controls */}
                    <div className="glass-panel" style={{
                      flex: '1 1 500px',
                      padding: '24px',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Role Assignment Verification</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Users must verify themselves to receive a member role.</p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={settings.verification.enabled}
                            onChange={() => handleToggle('verification.enabled')}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      {settings.verification.enabled && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>

                          {/* Verification Method Selection */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}>Verification Method</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                              {[
                                { id: 'button', title: 'Discord Button', desc: 'Click an interactive button to verify' },
                                { id: 'reaction', title: 'Emoji Reaction', desc: 'React with an emoji to verify (Reaction Role)' }
                              ].map(methodOption => (
                                <div
                                  key={methodOption.id}
                                  onClick={() => handleInputChange('verification.type', methodOption.id)}
                                  style={{
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: `2px solid ${settings.verification.type === methodOption.id || (!settings.verification.type && methodOption.id === 'button') ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                                    backgroundColor: settings.verification.type === methodOption.id || (!settings.verification.type && methodOption.id === 'button') ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                  }}
                                >
                                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: settings.verification.type === methodOption.id || (!settings.verification.type && methodOption.id === 'button') ? '#ffffff' : 'var(--text-secondary)' }}>
                                    {methodOption.title}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1rem' }}>
                                    {methodOption.desc}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Channel and Role selection */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Verification Channel</label>
                              <select
                                value={settings.verification.channelId}
                                onChange={(e) => handleInputChange('verification.channelId', e.target.value)}
                                className="glass-input"
                              >
                                <option value="">-- Select Channel --</option>
                                {channels.map(ch => (
                                  <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Role to Grant upon Verification</label>
                              <select
                                value={settings.verification.roleId}
                                onChange={(e) => handleInputChange('verification.roleId', e.target.value)}
                                className="glass-input"
                              >
                                <option value="">-- Select Role --</option>
                                {roles.map(role => (
                                  <option key={role.id} value={role.id} style={{ color: role.color }}>{role.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Conditional Text Fields based on type */}
                          {settings.verification.type === 'reaction' ? (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Reaction Emoji</label>
                              <input
                                type="text"
                                value={settings.verification.reactionEmoji || '✅'}
                                onChange={(e) => handleInputChange('verification.reactionEmoji', e.target.value)}
                                className="glass-input"
                                style={{ maxWidth: '200px' }}
                                placeholder="e.g. ✅ or custom emoji"
                              />
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                Use a standard emoji (like ✅, ⭐, 👍) or a custom server emoji.
                              </span>
                            </div>
                          ) : (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Verify Button Label</label>
                              <input
                                type="text"
                                value={settings.verification.buttonText || 'Verify'}
                                onChange={(e) => handleInputChange('verification.buttonText', e.target.value)}
                                className="glass-input"
                                placeholder="Verify"
                              />
                            </div>
                          )}

                          {/* Embed Description */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Verification Embed Description</label>
                            <textarea
                              rows="3"
                              value={settings.verification.welcomeMessage || ''}
                              onChange={(e) => handleInputChange('verification.welcomeMessage', e.target.value)}
                              className="glass-input"
                              placeholder={
                                settings.verification.type === 'reaction'
                                  ? 'React to this message with the emoji below to verify and gain access to the server.'
                                  : 'Click the button below to verify your account and gain access to the server.'
                              }
                            />
                          </div>

                          {/* Publish Panel card */}
                          <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderColor: 'var(--primary-glow)' }}>
                            <div>
                              <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px' }}>Publish Panel to Discord</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send the verification box with the interactive button/reaction directly to the selected channel.</p>
                            </div>
                            <button
                              type="button"
                              onClick={handlePublishVerification}
                              disabled={saving || !settings.verification.channelId || !settings.verification.roleId}
                              className="btn-success"
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              Publish Embed
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Live Discord Preview */}
                    <div style={{
                      flex: '1 0 350px',
                      maxWidth: '520px',
                      position: 'sticky',
                      top: '24px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <Eye size={14} />
                        Live Discord Preview
                      </span>
                      {settings.verification.enabled && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <DiscordMessagePreview
                            botUser={{ username: user?.username }}
                            guildName={guildName}
                            guildIcon={guildIcon}
                            message=""
                            buttonEnabled={settings.verification.type !== 'reaction'}
                            buttonLabel={settings.verification.buttonText || 'Verify'}
                            buttonUrl=""
                            embedEnabled={true}
                            embedTitle="Verification Required"
                            embedDesc={settings.verification.welcomeMessage || (
                              settings.verification.type === 'reaction'
                                ? 'React to this message with the emoji below to verify and gain access to the server.'
                                : 'Click the button below to verify your account and gain access to the server.'
                            )}
                            embedColor="#2563eb"
                            embedThumb=""
                            embedImage=""
                            isDM={false}
                          />
                          {/* Reaction Emoji rendering beneath the preview if reaction type */}
                          {settings.verification.type === 'reaction' && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: '#2b2d31',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              width: 'fit-content',
                              marginLeft: '56px',
                              gap: '6px',
                              border: '1px solid rgba(255,255,255,0.05)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              userSelect: 'none'
                            }}>
                              <span style={{ fontSize: '1.15rem' }}>{settings.verification.reactionEmoji || '✅'}</span>
                              <span style={{ fontSize: '0.8rem', color: '#949ba4', fontWeight: 'bold' }}>1</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: TICKET SYSTEM */}
              {/* TAB 8: SUPPORT TICKETS */}
              {activeTab === 'tickets' && settings && (() => {
                const rawPanels = (Array.isArray(settings.tickets?.panels) && settings.tickets.panels.length > 0)
                  ? settings.tickets.panels
                  : [{
                    id: 'default',
                    name: 'Support Panel',
                    enabled: settings.tickets?.enabled !== false,
                    channelId: settings.tickets?.channelId || '',
                    categoryId: settings.tickets?.categoryId || '',
                    supportRoleId: settings.tickets?.supportRoleId || '',
                    componentType: settings.tickets?.componentType || 'sections',
                    title: settings.tickets?.title || '🥥 Thengakola Support Panel',
                    welcomeMessage: settings.tickets?.welcomeMessage || 'Ayubowan! 🍃 Welcome to the Thengakola Support Desk.\n\nWhether you need help with your order or want to report an issue, we\'re here to help!',
                    selectPlaceholder: settings.tickets?.selectPlaceholder || 'Select a ticket category...',
                    accentColor: settings.tickets?.accentColor || '#22c55e',
                    thumbnailUrl: settings.tickets?.thumbnailUrl || '',
                    imageUrl: settings.tickets?.imageUrl || '',
                    footerText: settings.tickets?.footerText || 'Thengakola Support system',
                    options: (Array.isArray(settings.tickets?.options) && settings.tickets.options.length > 0)
                      ? settings.tickets.options
                      : [
                        {
                          label: 'Report an Issue',
                          emoji: '🍂',
                          style: 'danger',
                          description: 'Something not right? Let us know immediately!',
                          categoryId: settings.tickets?.categoryId || '',
                          supportRoleId: settings.tickets?.supportRoleId || '',
                          title: 'Report Issue',
                          ticketMessage: 'Welcome {user}! Please describe the issue you are facing. Support staff will assist you shortly.'
                        },
                        {
                          label: 'General Support',
                          emoji: '🍃',
                          style: 'success',
                          description: 'Track, change, or ask about your order',
                          categoryId: settings.tickets?.categoryId || '',
                          supportRoleId: settings.tickets?.supportRoleId || '',
                          title: 'General Support',
                          ticketMessage: 'Welcome {user}! How can we assist you with your order today?'
                        },
                        {
                          label: 'Suggestions',
                          emoji: '✨',
                          style: 'primary',
                          description: 'Share your ideas and feedback with us!',
                          categoryId: settings.tickets?.categoryId || '',
                          supportRoleId: settings.tickets?.supportRoleId || '',
                          title: 'Suggestions & Feedback',
                          ticketMessage: 'Welcome {user}! Please share your ideas or feedback with our team.'
                        }
                      ]
                  }];

                const currentPanelId = activeTicketPanelId && rawPanels.some(p => p.id === activeTicketPanelId)
                  ? activeTicketPanelId
                  : rawPanels[0].id;

                const activePanelIndex = Math.max(0, rawPanels.findIndex(p => p.id === currentPanelId));
                const activePanel = rawPanels[activePanelIndex] || rawPanels[0];

                const updatePanels = (nextPanels) => {
                  const active = nextPanels[activePanelIndex] || nextPanels[0];
                  const updatedTickets = {
                    ...(settings.tickets || {}),
                    panels: nextPanels,
                    ...(activePanelIndex === 0 ? {
                      channelId: active.channelId,
                      categoryId: active.categoryId,
                      supportRoleId: active.supportRoleId,
                      componentType: active.componentType,
                      title: active.title,
                      welcomeMessage: active.welcomeMessage,
                      selectPlaceholder: active.selectPlaceholder,
                      accentColor: active.accentColor,
                      thumbnailUrl: active.thumbnailUrl,
                      imageUrl: active.imageUrl,
                      footerText: active.footerText,
                      options: active.options,
                      buttonText: active.options?.[0]?.label || 'Create Ticket'
                    } : {})
                  };
                  handleInputChange('tickets', updatedTickets);
                };

                const updateActivePanelField = (field, value) => {
                  const nextPanels = rawPanels.map((p, idx) => {
                    if (idx === activePanelIndex) {
                      return { ...p, [field]: value };
                    }
                    return p;
                  });
                  updatePanels(nextPanels);
                };

                const handleAddPanel = () => {
                  if (rawPanels.length >= 10) return;
                  const newId = 'panel_' + Math.random().toString(36).substring(2, 9);
                  const newPanel = {
                    id: newId,
                    name: `Staff Application`,
                    enabled: true,
                    channelId: activePanel.channelId || '',
                    categoryId: activePanel.categoryId || '',
                    supportRoleId: activePanel.supportRoleId || '',
                    componentType: 'buttons',
                    title: 'Thenga Kola Staff Application',
                    welcomeMessage: 'Click the button below to apply for the staff team of Thenga Kola.\n\n🔹 **Requirements:**\n• Must be active in voice and chat\n• Follow all server rules strictly\n• Be respectful to all members',
                    selectPlaceholder: 'Select a category...',
                    accentColor: '#0284c7',
                    thumbnailUrl: activePanel.thumbnailUrl || '',
                    imageUrl: '',
                    footerText: 'Thengakola Support system',
                    options: [
                      {
                        label: 'Apply for Staff',
                        emoji: '📝',
                        style: 'success',
                        description: 'Submit an application for server staff team',
                        categoryId: activePanel.categoryId || '',
                        supportRoleId: activePanel.supportRoleId || '',
                        title: 'Staff Application',
                        ticketMessage: 'Welcome {user}! Please answer the application questions below. Our admins will review your submission.'
                      }
                    ]
                  };
                  const nextPanels = [...rawPanels, newPanel];
                  updatePanels(nextPanels);
                  setActiveTicketPanelId(newId);
                };

                const handleDuplicatePanel = () => {
                  if (rawPanels.length >= 10) return;
                  const newId = 'panel_' + Math.random().toString(36).substring(2, 9);
                  const duplicated = JSON.parse(JSON.stringify(activePanel));
                  duplicated.id = newId;
                  duplicated.name = `${activePanel.name} (Copy)`;
                  const nextPanels = [...rawPanels, duplicated];
                  updatePanels(nextPanels);
                  setActiveTicketPanelId(newId);
                };

                const handleRemovePanel = (panelIdToRemove) => {
                  if (rawPanels.length <= 1) return;
                  const nextPanels = rawPanels.filter(p => p.id !== panelIdToRemove);
                  updatePanels(nextPanels);
                  setActiveTicketPanelId(nextPanels[0].id);
                };

                const currentOptions = (Array.isArray(activePanel.options) && activePanel.options.length > 0)
                  ? activePanel.options
                  : [{
                    label: 'Create Ticket',
                    emoji: '🎫',
                    style: 'primary',
                    description: '',
                    categoryId: activePanel.categoryId || '',
                    supportRoleId: activePanel.supportRoleId || '',
                    title: 'Support Ticket',
                    ticketMessage: 'Welcome {user}! Please describe your issue. Support staff will assist you shortly.'
                  }];

                const updateTicketOptions = (newOptions) => {
                  updateActivePanelField('options', newOptions);
                };

                const handleOptionChange = (index, field, value) => {
                  const next = currentOptions.map((item, idx) => {
                    if (idx === index) {
                      return { ...item, [field]: value };
                    }
                    return item;
                  });
                  updateTicketOptions(next);
                };

                const handleAddOption = () => {
                  if (currentOptions.length >= 6) return;
                  const next = [
                    ...currentOptions,
                    {
                      label: `Option #${currentOptions.length + 1}`,
                      emoji: '🎫',
                      style: 'primary',
                      description: '',
                      categoryId: activePanel.categoryId || '',
                      supportRoleId: activePanel.supportRoleId || '',
                      title: 'Support Ticket',
                      ticketMessage: 'Welcome {user}! Please describe your issue. Support staff will assist you shortly.'
                    }
                  ];
                  updateTicketOptions(next);
                };

                const handleRemoveOption = (index) => {
                  if (currentOptions.length <= 1) {
                    const next = [{
                      label: 'Create Ticket',
                      emoji: '🎫',
                      style: 'primary',
                      description: '',
                      categoryId: '',
                      supportRoleId: '',
                      title: 'Support Ticket',
                      ticketMessage: 'Welcome {user}! Please describe your issue. Support staff will assist you shortly.'
                    }];
                    updateTicketOptions(next);
                  } else {
                    const next = currentOptions.filter((_, idx) => idx !== index);
                    updateTicketOptions(next);
                  }
                };

                const handlePanelImageUpload = async (e, fieldName) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  e.target.value = '';
                  if (fieldName === 'thumbnailUrl') setUploadingTicketThumb(true);
                  else setUploadingTicketImage(true);
                  setErrorMsg(null);
                  try {
                    const res = await api.uploadTicketImage(guildId, file);
                    updateActivePanelField(fieldName, res.url);
                    setSuccessMsg(fieldName === 'thumbnailUrl' ? 'Ticket thumbnail uploaded!' : 'Ticket banner image uploaded!');
                    setTimeout(() => setSuccessMsg(null), 4000);
                  } catch (err) {
                    console.error(err);
                    setErrorMsg(err.message || 'Failed to upload ticket image.');
                  } finally {
                    if (fieldName === 'thumbnailUrl') setUploadingTicketThumb(false);
                    else setUploadingTicketImage(false);
                  }
                };

                const componentType = activePanel.componentType || 'sections';

                const previewButtons = currentOptions.map(opt => ({
                  label: (opt.emoji ? `${opt.emoji} ` : '') + (opt.label || 'Ticket'),
                  style: opt.style || 'primary'
                }));

                const colorPresets = [
                  { name: 'Emerald', hex: '#22c55e' },
                  { name: 'Sky Blue', hex: '#0284c7' },
                  { name: 'Blurple', hex: '#5865f2' },
                  { name: 'Crimson', hex: '#ef4444' },
                  { name: 'Amber', hex: '#f59e0b' },
                  { name: 'Purple', hex: '#a855f7' },
                  { name: 'Teal', hex: '#14b8a6' },
                  { name: 'Slate', hex: '#334155' }
                ];

                return (
                  <div>
                    <div className="preview-layout-container">
                      {/* Left Column: Form Controls */}
                      <div style={{
                        flex: '1 1 500px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                      }}>

                        {/* MASTER TICKET SYSTEM ACTIVATION & MULTI-PANEL NAVIGATION */}
                        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Support Ticket System <span style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg, #10b981, #0284c7)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>Multi-Panel V2</span>
                              </h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                Create multiple ticket panels (e.g. Support Desk, Staff Application), customize button colors & layout, and manage staff claiming.
                              </p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={settings.tickets?.enabled || false}
                                onChange={() => handleToggle('tickets.enabled')}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          {settings.tickets?.enabled && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>

                              {/* TICKET PANELS TAB SELECTOR ("ADD 1 MORE IN TICKET SECTION") */}
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
                                    TICKET PANELS ({rawPanels.length} / 10)
                                  </label>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      type="button"
                                      onClick={handleDuplicatePanel}
                                      disabled={rawPanels.length >= 10}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'var(--text-secondary)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer'
                                      }}
                                      title="Duplicate active panel"
                                    >
                                      Clone Panel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleAddPanel}
                                      disabled={rawPanels.length >= 10}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                                        border: '1px solid rgba(37, 99, 235, 0.35)',
                                        color: '#60a5fa',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        cursor: rawPanels.length >= 10 ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      + Add 1 More Ticket Panel
                                    </button>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  {rawPanels.map((p, idx) => {
                                    const isSelected = p.id === currentPanelId;
                                    return (
                                      <div
                                        key={p.id || idx}
                                        onClick={() => setActiveTicketPanelId(p.id)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255,255,255,0.03)',
                                          border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                          cursor: 'pointer',
                                          fontSize: '0.85rem',
                                          fontWeight: isSelected ? '700' : '500',
                                          transition: 'all 0.15s ease'
                                        }}
                                      >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.accentColor || '#22c55e' }}></span>
                                        <span>{p.name || `Panel #${idx + 1}`}</span>
                                        {rawPanels.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemovePanel(p.id);
                                            }}
                                            title="Delete panel"
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              color: '#ef4444',
                                              cursor: 'pointer',
                                              padding: '0 2px',
                                              fontSize: '0.9rem',
                                              display: 'flex',
                                              alignItems: 'center',
                                              opacity: 0.8
                                            }}
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* ACTIVE PANEL NAME & TARGET CHANNEL */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                    Panel Name (Internal Label)
                                  </label>
                                  <input
                                    type="text"
                                    value={activePanel.name || ''}
                                    onChange={(e) => updateActivePanelField('name', e.target.value)}
                                    className="glass-input"
                                    placeholder="e.g. Staff Application"
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                    Publish Target Channel <span style={{ color: 'var(--danger)' }}>*</span>
                                  </label>
                                  <select
                                    value={activePanel.channelId || ''}
                                    onChange={(e) => updateActivePanelField('channelId', e.target.value)}
                                    className="glass-input"
                                  >
                                    <option value="">-- Select Channel --</option>
                                    {channels.map(ch => (
                                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* BUTTON PLACEMENT / COMPONENT TYPE ("WHERE TO KEEP BUTTONS") */}
                              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '700' }}>
                                  Where to Keep Buttons (Component Layout Style)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
                                  {/* Option 1: Side-by-Side Sections (Screenshot 1) */}
                                  <button
                                    type="button"
                                    onClick={() => updateActivePanelField('componentType', 'sections')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: componentType === 'sections' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: componentType === 'sections' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: componentType === 'sections' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: componentType === 'sections' ? '#34d399' : 'inherit', fontSize: '0.92rem' }}>
                                      🍂 Side-by-Side Sections
                                    </span>
                                    <span style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 'normal' }}>
                                      Buttons on the right of each category row with dividers (Screenshot 1)
                                    </span>
                                  </button>

                                  {/* Option 2: Bottom Action Row (Screenshot 2) */}
                                  <button
                                    type="button"
                                    onClick={() => updateActivePanelField('componentType', 'buttons')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: componentType === 'buttons' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: componentType === 'buttons' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: componentType === 'buttons' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: componentType === 'buttons' ? 'var(--primary)' : 'inherit', fontSize: '0.92rem' }}>
                                      🔘 Bottom Action Rows
                                    </span>
                                    <span style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 'normal' }}>
                                      Description on top, colored buttons in a bottom row (Screenshot 2)
                                    </span>
                                  </button>

                                  {/* Option 3: Select Menu Dropdown */}
                                  <button
                                    type="button"
                                    onClick={() => updateActivePanelField('componentType', 'select')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: componentType === 'select' ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: componentType === 'select' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: componentType === 'select' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: componentType === 'select' ? '#a78bfa' : 'inherit', fontSize: '0.92rem' }}>
                                      📋 Select Dropdown (V2)
                                    </span>
                                    <span style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 'normal' }}>
                                      Interactive Discord select dropdown menu
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {settings.tickets?.enabled && (
                          <>
                            {/* PANEL EMBED & APPEARANCE CONFIGURATION */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                PANEL EMBED APPEARANCE & BRANDING
                              </span>

                              {/* Panel Accent Color Picker & Presets */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                  Panel Accent Color (Side Strip Border)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                  <input
                                    type="color"
                                    value={activePanel.accentColor || '#22c55e'}
                                    onChange={(e) => updateActivePanelField('accentColor', e.target.value)}
                                    style={{
                                      width: '42px',
                                      height: '36px',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      backgroundColor: 'transparent'
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={activePanel.accentColor || '#22c55e'}
                                    onChange={(e) => updateActivePanelField('accentColor', e.target.value)}
                                    className="glass-input"
                                    style={{ width: '120px', fontFamily: 'monospace' }}
                                    placeholder="#22c55e"
                                  />
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {colorPresets.map((preset) => (
                                      <button
                                        key={preset.hex}
                                        type="button"
                                        onClick={() => updateActivePanelField('accentColor', preset.hex)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '3px 8px',
                                          borderRadius: '4px',
                                          border: activePanel.accentColor === preset.hex ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                                          backgroundColor: 'rgba(255,255,255,0.04)',
                                          color: '#ffffff',
                                          fontSize: '0.75rem',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: preset.hex }}></span>
                                        <span>{preset.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Title & Placeholder */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                    Panel Embed Title
                                  </label>
                                  <input
                                    type="text"
                                    value={activePanel.title || ''}
                                    onChange={(e) => updateActivePanelField('title', e.target.value)}
                                    className="glass-input"
                                    placeholder="🥥 Thengakola Support Panel"
                                  />
                                </div>

                                {componentType === 'select' && (
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                      Select Menu Placeholder
                                    </label>
                                    <input
                                      type="text"
                                      value={activePanel.selectPlaceholder || ''}
                                      onChange={(e) => updateActivePanelField('selectPlaceholder', e.target.value)}
                                      className="glass-input"
                                      placeholder="Select a ticket category..."
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Welcome Message / Description */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                  Panel Embed Description (Markdown Supported)
                                </label>
                                <textarea
                                  rows="3"
                                  value={activePanel.welcomeMessage || ''}
                                  onChange={(e) => updateActivePanelField('welcomeMessage', e.target.value)}
                                  className="glass-input"
                                  placeholder="Ayubowan! 🍃 Welcome to the Thengakola Support Desk..."
                                />
                              </div>

                              {/* Top-Right Thumbnail Upload & URL Input (Screenshot Logo) */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
                                      <ImageIcon size={15} color="var(--primary)" />
                                      Panel Thumbnail Logo (Top Right Square)
                                    </label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                                      Display your server logo or custom icon on the top right (Image 1 & 2 tea cup logo).
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                      type="file"
                                      ref={ticketThumbFileRef}
                                      onChange={(e) => handlePanelImageUpload(e, 'thumbnailUrl')}
                                      accept="image/png, image/jpeg, image/gif, image/webp"
                                      style={{ display: 'none' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => ticketThumbFileRef.current?.click()}
                                      disabled={uploadingTicketThumb}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                        border: '1px solid rgba(59, 130, 246, 0.35)',
                                        color: '#60a5fa',
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: uploadingTicketThumb ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {uploadingTicketThumb ? (
                                        <>
                                          <RotateCw size={13} className="spin-animation" />
                                          <span>Uploading...</span>
                                        </>
                                      ) : (
                                        <>
                                          <UploadCloud size={13} />
                                          <span>Upload Thumbnail</span>
                                        </>
                                      )}
                                    </button>

                                    {activePanel.thumbnailUrl && (
                                      <button
                                        type="button"
                                        onClick={() => updateActivePanelField('thumbnailUrl', '')}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                          border: '1px solid rgba(239, 68, 68, 0.25)',
                                          color: '#f87171',
                                          padding: '5px 10px',
                                          borderRadius: '6px',
                                          fontSize: '0.8rem',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 size={13} />
                                        <span>Clear</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={activePanel.thumbnailUrl || ''}
                                    onChange={(e) => updateActivePanelField('thumbnailUrl', e.target.value)}
                                    className="glass-input"
                                    placeholder="Paste thumbnail image URL or click Upload"
                                    style={{ flex: 1 }}
                                  />
                                  {activePanel.thumbnailUrl && (
                                    <img
                                      src={resolveUploadUrl(activePanel.thumbnailUrl)}
                                      alt="Thumbnail"
                                      style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Large Banner Image Upload & URL */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
                                      <ImageIcon size={15} color="var(--primary)" />
                                      Panel Large Banner Image (Optional)
                                    </label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                                      Full-width media gallery banner image displayed below ticket options.
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                      type="file"
                                      ref={ticketImageFileRef}
                                      onChange={(e) => handlePanelImageUpload(e, 'imageUrl')}
                                      accept="image/png, image/jpeg, image/gif, image/webp"
                                      style={{ display: 'none' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => ticketImageFileRef.current?.click()}
                                      disabled={uploadingTicketImage}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                        border: '1px solid rgba(59, 130, 246, 0.35)',
                                        color: '#60a5fa',
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: uploadingTicketImage ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {uploadingTicketImage ? (
                                        <>
                                          <RotateCw size={13} className="spin-animation" />
                                          <span>Uploading...</span>
                                        </>
                                      ) : (
                                        <>
                                          <UploadCloud size={13} />
                                          <span>Upload Banner</span>
                                        </>
                                      )}
                                    </button>

                                    {activePanel.imageUrl && (
                                      <button
                                        type="button"
                                        onClick={() => updateActivePanelField('imageUrl', '')}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                          border: '1px solid rgba(239, 68, 68, 0.25)',
                                          color: '#f87171',
                                          padding: '5px 10px',
                                          borderRadius: '6px',
                                          fontSize: '0.8rem',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 size={13} />
                                        <span>Clear</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={activePanel.imageUrl || ''}
                                    onChange={(e) => updateActivePanelField('imageUrl', e.target.value)}
                                    className="glass-input"
                                    placeholder="Paste banner image/GIF URL or click Upload"
                                    style={{ flex: 1 }}
                                  />
                                </div>
                              </div>

                              {/* Footer Text */}
                              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                  Panel Footer Text
                                </label>
                                <input
                                  type="text"
                                  value={activePanel.footerText || ''}
                                  onChange={(e) => updateActivePanelField('footerText', e.target.value)}
                                  className="glass-input"
                                  placeholder="e.g. Thengakola Support system"
                                />
                              </div>
                            </div>

                            {/* TICKET CATEGORIES & BUTTONS BUILDER */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                                    Ticket Categories & Buttons ({currentOptions.length} / 6)
                                  </h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                                    Customize category button colors, labels, emojis, and descriptions.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddOption}
                                  disabled={currentOptions.length >= 6}
                                  className="btn-primary"
                                  style={{
                                    padding: '6px 14px',
                                    fontSize: '0.825rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: currentOptions.length >= 6 ? 0.5 : 1,
                                    cursor: currentOptions.length >= 6 ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <span>+ Add Category Option</span>
                                </button>
                              </div>

                              {/* Option Cards inside Active Panel */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {currentOptions.map((opt, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                      border: '1px solid rgba(255, 255, 255, 0.08)',
                                      borderRadius: '10px',
                                      padding: '18px',
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                          OPTION #{index + 1}
                                        </span>
                                        <span style={{
                                          backgroundColor: opt.style === 'danger' ? '#ef4444' : opt.style === 'success' ? '#22c55e' : opt.style === 'secondary' ? '#6b7280' : '#3b82f6',
                                          color: '#ffffff',
                                          fontSize: '0.72rem',
                                          fontWeight: '700',
                                          padding: '1px 6px',
                                          borderRadius: '4px',
                                          textTransform: 'uppercase'
                                        }}>
                                          {opt.style || 'primary'}
                                        </span>
                                      </div>
                                      {currentOptions.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveOption(index)}
                                          style={{
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Remove Option
                                        </button>
                                      )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                                      {/* Option Label */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Button / Option Label <span style={{ color: 'var(--danger)' }}>*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={opt.label || ''}
                                          onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                          className="glass-input"
                                          placeholder="e.g. Report an Issue"
                                        />
                                      </div>

                                      {/* Emoji */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Option Emoji
                                        </label>
                                        <input
                                          type="text"
                                          value={opt.emoji || ''}
                                          onChange={(e) => handleOptionChange(index, 'emoji', e.target.value)}
                                          className="glass-input"
                                          placeholder="e.g. 🍂, 🍃, ✨"
                                        />
                                      </div>

                                      {/* Button Color / Style */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Button Color / Style
                                        </label>
                                        <select
                                          value={opt.style || 'primary'}
                                          onChange={(e) => handleOptionChange(index, 'style', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="primary">Primary (Blue / Blurple)</option>
                                          <option value="success">Success (Green)</option>
                                          <option value="danger">Danger (Red)</option>
                                          <option value="secondary">Secondary (Grey)</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Option Subtext / Description */}
                                    <div style={{ marginBottom: '14px' }}>
                                      <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        Option Subtext / Description (Shown beside button in Side-by-Side layout)
                                      </label>
                                      <input
                                        type="text"
                                        value={opt.description || ''}
                                        onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Something not right? Let us know immediately!"
                                      />
                                    </div>

                                    {/* Parent Category & Role */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Ticket Parent Category
                                        </label>
                                        <select
                                          value={opt.categoryId || activePanel.categoryId || ''}
                                          onChange={(e) => handleOptionChange(index, 'categoryId', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="">-- Select Category --</option>
                                          {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Support Team Role
                                        </label>
                                        <select
                                          value={opt.supportRoleId || activePanel.supportRoleId || ''}
                                          onChange={(e) => handleOptionChange(index, 'supportRoleId', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="">-- Select Role --</option>
                                          {roles.map(role => (
                                            <option key={role.id} value={role.id} style={{ color: role.color }}>{role.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    {/* Ticket Room Title & Welcome Message */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Ticket Channel Title
                                        </label>
                                        <input
                                          type="text"
                                          value={opt.title || ''}
                                          onChange={(e) => handleOptionChange(index, 'title', e.target.value)}
                                          className="glass-input"
                                          placeholder="Support Ticket"
                                        />
                                      </div>

                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                          <label style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                                            Ticket Channel Welcome Message
                                          </label>
                                          <div style={{ display: 'flex', gap: '4px' }}>
                                            {['{user}', '{username}', '{server}'].map(tag => (
                                              <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                  const curr = opt.ticketMessage || '';
                                                  handleOptionChange(index, 'ticketMessage', curr + ' ' + tag);
                                                }}
                                                style={{
                                                  background: 'rgba(255,255,255,0.06)',
                                                  border: '1px solid rgba(255,255,255,0.15)',
                                                  color: 'var(--primary)',
                                                  borderRadius: '4px',
                                                  padding: '2px 6px',
                                                  fontSize: '0.7rem',
                                                  cursor: 'pointer'
                                                }}
                                              >
                                                +{tag}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <textarea
                                          rows="2"
                                          value={opt.ticketMessage || ''}
                                          onChange={(e) => handleOptionChange(index, 'ticketMessage', e.target.value)}
                                          className="glass-input"
                                          placeholder="Welcome {user}! Please describe your issue. Support staff will assist you shortly."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* TICKET ROOM ACTION BUTTONS & CLAIM CUSTOMIZATION ("THE COLOUROF TICKET CLAIMG BUTTONS AND ALL THINGS") */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                              <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Lock size={18} color="var(--primary)" />
                                  Ticket Room Action Buttons & Claim Styling
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                  Customize the colors, labels, and emojis of the <strong>Claim</strong> and <strong>Close Ticket</strong> buttons inside opened ticket channels.
                                </p>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>

                                {/* Ticket Room Embed Color */}
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                    Ticket Room Welcome Embed Color
                                  </label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <input
                                      type="color"
                                      value={settings.tickets?.ticketEmbedColor || '#2563eb'}
                                      onChange={(e) => handleInputChange('tickets.ticketEmbedColor', e.target.value)}
                                      style={{
                                        width: '42px',
                                        height: '36px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent'
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={settings.tickets?.ticketEmbedColor || '#2563eb'}
                                      onChange={(e) => handleInputChange('tickets.ticketEmbedColor', e.target.value)}
                                      className="glass-input"
                                      style={{ width: '120px', fontFamily: 'monospace' }}
                                      placeholder="#2563eb"
                                    />
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                      {colorPresets.map((preset) => (
                                        <button
                                          key={preset.hex}
                                          type="button"
                                          onClick={() => handleInputChange('tickets.ticketEmbedColor', preset.hex)}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            border: (settings.tickets?.ticketEmbedColor || '#2563eb') === preset.hex ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                            color: '#ffffff',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: preset.hex }}></span>
                                          <span>{preset.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* STAFF CLAIM BUTTON CONTROLS */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div>
                                      <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                                        Staff Claim Ticket Button
                                      </div>
                                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                        Allow support staff to claim tickets and take ownership.
                                      </div>
                                    </div>
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        checked={settings.tickets?.enableClaim !== false}
                                        onChange={() => handleInputChange('tickets.enableClaim', settings.tickets?.enableClaim === false ? true : false)}
                                      />
                                      <span className="slider"></span>
                                    </label>
                                  </div>

                                  {settings.tickets?.enableClaim !== false && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                      {/* Claim Button Label */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                          Claim Button Label
                                        </label>
                                        <input
                                          type="text"
                                          value={settings.tickets?.claimButtonLabel || 'Claim'}
                                          onChange={(e) => handleInputChange('tickets.claimButtonLabel', e.target.value)}
                                          className="glass-input"
                                          placeholder="Claim"
                                        />
                                      </div>

                                      {/* Claim Button Color/Style */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                          Claim Button Color
                                        </label>
                                        <select
                                          value={settings.tickets?.claimButtonStyle || 'primary'}
                                          onChange={(e) => handleInputChange('tickets.claimButtonStyle', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="primary">Primary (Blue / Blurple)</option>
                                          <option value="success">Success (Green)</option>
                                          <option value="secondary">Secondary (Grey)</option>
                                          <option value="danger">Danger (Red)</option>
                                        </select>
                                      </div>

                                      {/* Claim Button Emoji */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                          Claim Button Emoji
                                        </label>
                                        <input
                                          type="text"
                                          value={settings.tickets?.claimButtonEmoji || '📌'}
                                          onChange={(e) => handleInputChange('tickets.claimButtonEmoji', e.target.value)}
                                          className="glass-input"
                                          placeholder="📌"
                                        />
                                      </div>

                                      {/* Claimed Button Color/Style */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                          Claimed State Color
                                        </label>
                                        <select
                                          value={settings.tickets?.claimedButtonStyle || 'success'}
                                          onChange={(e) => handleInputChange('tickets.claimedButtonStyle', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="success">Success (Green)</option>
                                          <option value="primary">Primary (Blue / Blurple)</option>
                                          <option value="secondary">Secondary (Grey)</option>
                                          <option value="danger">Danger (Red)</option>
                                        </select>
                                      </div>

                                      {/* Claimed Button Label Template */}
                                      <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                          Claimed Button Label Template
                                        </label>
                                        <input
                                          type="text"
                                          value={settings.tickets?.claimedButtonLabel || 'Claimed by {username}'}
                                          onChange={(e) => handleInputChange('tickets.claimedButtonLabel', e.target.value)}
                                          className="glass-input"
                                          placeholder="Claimed by {username}"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* CLOSE TICKET BUTTON CONTROLS */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                                    Close Ticket Button Styling
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {/* Close Button Label */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Close Button Label
                                      </label>
                                      <input
                                        type="text"
                                        value={settings.tickets?.closeButtonLabel || 'Close Ticket'}
                                        onChange={(e) => handleInputChange('tickets.closeButtonLabel', e.target.value)}
                                        className="glass-input"
                                        placeholder="Close Ticket"
                                      />
                                    </div>

                                    {/* Close Button Color/Style */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Close Button Color
                                      </label>
                                      <select
                                        value={settings.tickets?.closeButtonStyle || 'danger'}
                                        onChange={(e) => handleInputChange('tickets.closeButtonStyle', e.target.value)}
                                        className="glass-input"
                                      >
                                        <option value="danger">Danger (Red)</option>
                                        <option value="secondary">Secondary (Grey)</option>
                                        <option value="primary">Primary (Blue / Blurple)</option>
                                        <option value="success">Success (Green)</option>
                                      </select>
                                    </div>

                                    {/* Close Button Emoji */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Close Button Emoji
                                      </label>
                                      <input
                                        type="text"
                                        value={settings.tickets?.closeButtonEmoji || '🔒'}
                                        onChange={(e) => handleInputChange('tickets.closeButtonEmoji', e.target.value)}
                                        className="glass-input"
                                        placeholder="🔒"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* INTERACTIVE PREVIEW OF TICKET ROOM BUTTONS */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                                      TICKET ROOM BUTTONS PREVIEW (INSIDE TICKET CHANNEL)
                                    </span>
                                    {settings.tickets?.enableClaim !== false && (
                                      <button
                                        type="button"
                                        onClick={() => setTicketPreviewClaimState(!ticketPreviewClaimState)}
                                        style={{
                                          background: 'rgba(255,255,255,0.06)',
                                          border: '1px solid rgba(255,255,255,0.15)',
                                          color: ticketPreviewClaimState ? '#34d399' : '#60a5fa',
                                          borderRadius: '4px',
                                          padding: '2px 8px',
                                          fontSize: '0.72rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {ticketPreviewClaimState ? '✓ Viewing: Claimed State' : '👁️ Click to Test Claimed State'}
                                      </button>
                                    )}
                                  </div>

                                  <div style={{
                                    backgroundColor: '#2b2d31',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    padding: '14px',
                                    borderLeft: `4px solid ${settings.tickets?.ticketEmbedColor || '#2563eb'}`
                                  }}>
                                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem', marginBottom: '4px' }}>
                                      {activePanel.options[0]?.title || 'Support Ticket'}
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#dbdee1', marginBottom: '12px' }}>
                                      Welcome <span style={{ color: '#5865F2', backgroundColor: 'rgba(88,101,242,0.15)', padding: '1px 4px', borderRadius: '3px' }}>@Member</span>! Please describe your issue. Support staff will assist you shortly.
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                      {/* Close Button Preview */}
                                      <span style={{
                                        backgroundColor: (settings.tickets?.closeButtonStyle === 'secondary') ? '#4e5058'
                                          : (settings.tickets?.closeButtonStyle === 'primary') ? '#5865F2'
                                            : (settings.tickets?.closeButtonStyle === 'success') ? '#248046'
                                              : '#da373c',
                                        color: '#ffffff',
                                        padding: '6px 14px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        userSelect: 'none'
                                      }}>
                                        <span>{settings.tickets?.closeButtonEmoji || '🔒'}</span>
                                        <span>{settings.tickets?.closeButtonLabel || 'Close Ticket'}</span>
                                      </span>

                                      {/* Claim Button Preview */}
                                      {settings.tickets?.enableClaim !== false && (
                                        <span style={{
                                          backgroundColor: ticketPreviewClaimState
                                            ? ((settings.tickets?.claimedButtonStyle === 'primary') ? '#5865F2'
                                              : (settings.tickets?.claimedButtonStyle === 'secondary') ? '#4e5058'
                                                : (settings.tickets?.claimedButtonStyle === 'danger') ? '#da373c'
                                                  : '#248046')
                                            : ((settings.tickets?.claimButtonStyle === 'success') ? '#248046'
                                              : (settings.tickets?.claimButtonStyle === 'secondary') ? '#4e5058'
                                                : (settings.tickets?.claimButtonStyle === 'danger') ? '#da373c'
                                                  : '#5865F2'),
                                          color: '#ffffff',
                                          padding: '6px 14px',
                                          borderRadius: '4px',
                                          fontSize: '0.85rem',
                                          fontWeight: '600',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          userSelect: 'none'
                                        }}>
                                          <span>{settings.tickets?.claimButtonEmoji || '📌'}</span>
                                          <span>
                                            {ticketPreviewClaimState
                                              ? (settings.tickets?.claimedButtonLabel || 'Claimed by {username}').replace('{username}', user?.username || 'Staff')
                                              : (settings.tickets?.claimButtonLabel || 'Claim')}
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* TICKET TRANSCRIPTS & DM SETTINGS */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Download size={18} color="var(--primary)" />
                                    Direct Message Ticket Transcript
                                  </h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                    Automatically export and send a full chat history HTML transcript to the member&apos;s DM when their ticket is closed.
                                  </p>
                                </div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={settings.tickets?.dmTranscript !== false}
                                    onChange={() => handleInputChange('tickets.dmTranscript', settings.tickets?.dmTranscript === false ? true : false)}
                                  />
                                  <span className="slider"></span>
                                </label>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Transcript Archive Channel (Optional Staff Backup)
                                  </label>
                                  <select
                                    value={settings.tickets?.transcriptChannelId || ''}
                                    onChange={(e) => handleInputChange('tickets.transcriptChannelId', e.target.value)}
                                    className="glass-input"
                                  >
                                    <option value="">-- No Backup Channel (DM Only) --</option>
                                    {channels.map(ch => (
                                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* TICKET PERMISSIONS & STAFF CONTROLS */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Shield size={18} color="var(--primary)" />
                                  Ticket Close & Staff Permissions
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                  Configure who is authorized to close tickets and manage staff controls.
                                </p>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                                      Allow Member Who Opened Ticket to Close
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                      When disabled (recommended), only administrators and assigned support staff can close tickets.
                                    </div>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={settings.tickets?.allowUserClose === true}
                                      onChange={() => handleInputChange('tickets.allowUserClose', settings.tickets?.allowUserClose === true ? false : true)}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                                    Roles Allowed to Close Tickets
                                  </label>
                                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                                    Server Administrators and Support Team roles can always close tickets. Select any additional staff roles permitted to close tickets:
                                  </p>

                                  <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.25)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                    {roles.filter(r => r.name !== '@everyone').map(role => {
                                      const closeRoles = Array.isArray(settings.tickets?.closeRoles) ? settings.tickets.closeRoles : [];
                                      const isChecked = closeRoles.includes(role.id);
                                      return (
                                        <label key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.83rem', userSelect: 'none' }}>
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                              const updated = isChecked
                                                ? closeRoles.filter(id => id !== role.id)
                                                : [...closeRoles, role.id];
                                              handleInputChange('tickets.closeRoles', updated);
                                            }}
                                          />
                                          <span style={{ color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            @{role.name}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* PUBLISH PANEL TO DISCORD */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                              <div>
                                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px' }}>
                                  Publish "{activePanel.name || activePanel.title}" to Discord
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  Send this ticket panel embed directly to <strong style={{ color: '#ffffff' }}>#{channels.find(c => c.id === activePanel.channelId)?.name || 'selected channel'}</strong> with {componentType === 'select' ? 'Component V2 Select Menu' : componentType === 'sections' ? `${currentOptions.length} Side-by-Side Sections with buttons` : `${currentOptions.length} Action Row Buttons`}.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePublishTickets(activePanel.id)}
                                disabled={saving || publishingTickets || !activePanel.channelId}
                                className="btn-success"
                                style={{ padding: '10px 20px', fontSize: '0.875rem', fontWeight: '600' }}
                              >
                                {publishingTickets ? 'Publishing...' : 'Publish Panel Embed'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right Column: Live Discord Preview */}
                      <div style={{
                        flex: '1 0 350px',
                        maxWidth: '520px',
                        position: 'sticky',
                        top: '24px',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          <Eye size={14} />
                          Live Discord Panel Preview ({activePanel.name || 'Panel'})
                        </span>

                        {settings.tickets?.enabled && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <DiscordMessagePreview
                              botUser={{ username: user?.username }}
                              guildName={guildName}
                              guildIcon={guildIcon}
                              message=""
                              buttonEnabled={false}
                              layout={componentType}
                              sectionOptions={componentType === 'sections' ? currentOptions : []}
                              buttons={componentType === 'buttons' ? previewButtons : []}
                              selectMenuEnabled={componentType === 'select'}
                              selectMenuPlaceholder={activePanel.selectPlaceholder || 'Select a ticket category...'}
                              selectMenuOptions={currentOptions}
                              embedEnabled={true}
                              embedTitle={activePanel.title || 'Support Ticket System'}
                              embedDesc={activePanel.welcomeMessage || 'Click an option below to open a ticket.'}
                              embedColor={activePanel.accentColor || '#22c55e'}
                              embedThumb={activePanel.thumbnailUrl || guildIcon || ''}
                              embedImage={resolveUploadUrl(activePanel.imageUrl || '')}
                              embedFooterEnabled={true}
                              embedFooterText={activePanel.footerText || `${guildName} Support System`}
                              isDM={false}
                            />

                            {/* Mini Preview for Opened Ticket Channel */}
                            <div style={{
                              backgroundColor: '#1e1f22',
                              borderRadius: '8px',
                              padding: '12px',
                              border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: '#949ba4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Lock size={12} color="var(--primary)" />
                                <span>Inside Opened Ticket Channel Preview</span>
                              </div>
                              <div style={{
                                backgroundColor: '#2b2d31',
                                borderRadius: '6px',
                                padding: '10px 12px',
                                borderLeft: `3px solid ${settings.tickets?.ticketEmbedColor || activePanel.accentColor || '#2563eb'}`
                              }}>
                                <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.85rem', marginBottom: '2px' }}>
                                  {currentOptions[0]?.title || 'Support Ticket'}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#dbdee1', marginBottom: '8px' }}>
                                  Welcome <span style={{ color: '#5865F2' }}>@User</span>! Support staff will assist you shortly.
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  <span style={{
                                    backgroundColor: settings.tickets?.closeButtonStyle === 'secondary' ? '#4e5058' : settings.tickets?.closeButtonStyle === 'primary' ? '#5865F2' : settings.tickets?.closeButtonStyle === 'success' ? '#248046' : '#da373c',
                                    color: '#ffffff',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.78rem',
                                    fontWeight: '600',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    <span>{settings.tickets?.closeButtonEmoji || '🔒'}</span>
                                    <span>{settings.tickets?.closeButtonLabel || 'Close Ticket'}</span>
                                  </span>

                                  {settings.tickets?.enableClaim !== false && (
                                    <span style={{
                                      backgroundColor: settings.tickets?.claimButtonStyle === 'success' ? '#248046' : settings.tickets?.claimButtonStyle === 'secondary' ? '#4e5058' : settings.tickets?.claimButtonStyle === 'danger' ? '#da373c' : '#5865F2',
                                      color: '#ffffff',
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                      fontSize: '0.78rem',
                                      fontWeight: '600',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <span>{settings.tickets?.claimButtonEmoji || '📌'}</span>
                                      <span>{settings.tickets?.claimButtonLabel || 'Claim'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB: SELF ROLES (COMPONENT V2 DROPDOWN ROLES) */}
              {activeTab === 'selfroles' && (() => {
                const currentOptions = Array.isArray(settings.selfRoles?.options) && settings.selfRoles.options.length > 0
                  ? settings.selfRoles.options
                  : [
                    { id: 'opt_1', label: 'Thiruvananthapuram', emoji: '🌴', description: 'Find people in Thiruvananthapuram', roleId: '' },
                    { id: 'opt_2', label: 'Kollam', emoji: '🌴', description: 'Find people in Kollam', roleId: '' },
                    { id: 'opt_3', label: 'Pathanamthitta', emoji: '🌴', description: 'Find people in Pathanamthitta', roleId: '' },
                    { id: 'opt_4', label: 'Alappuzha', emoji: '🌴', description: 'Find people in Alappuzha', roleId: '' },
                    { id: 'opt_5', label: 'Kottayam', emoji: '🌴', description: 'Find people in Kottayam', roleId: '' }
                  ];

                const updateSelfRoleOptions = (nextOptions) => {
                  handleInputChange('selfRoles.options', nextOptions);
                };

                const handleOptionChange = (index, field, value) => {
                  const next = currentOptions.map((item, idx) => {
                    if (idx === index) {
                      return { ...item, [field]: value };
                    }
                    return item;
                  });
                  updateSelfRoleOptions(next);
                };

                const handleAddOption = () => {
                  if (currentOptions.length >= 25) return;
                  const next = [
                    ...currentOptions,
                    {
                      id: 'opt_' + Math.random().toString(36).substring(2, 9),
                      label: `Option #${currentOptions.length + 1}`,
                      emoji: '🌴',
                      description: '',
                      roleId: ''
                    }
                  ];
                  updateSelfRoleOptions(next);
                };

                const handleRemoveOption = (index) => {
                  if (currentOptions.length <= 1) {
                    const next = [{
                      id: 'opt_1',
                      label: 'Role Option 1',
                      emoji: '🌴',
                      description: '',
                      roleId: ''
                    }];
                    updateSelfRoleOptions(next);
                  } else {
                    const next = currentOptions.filter((_, idx) => idx !== index);
                    updateSelfRoleOptions(next);
                  }
                };

                const handleMoveOption = (index, direction) => {
                  const targetIndex = index + direction;
                  if (targetIndex < 0 || targetIndex >= currentOptions.length) return;
                  const next = [...currentOptions];
                  const temp = next[index];
                  next[index] = next[targetIndex];
                  next[targetIndex] = temp;
                  updateSelfRoleOptions(next);
                };

                const selfRoleMode = settings.selfRoles?.mode || 'onetime';

                let previewDesc = (settings.selfRoles?.description || 'Choose your district and find people near you to chat and connect...').trim();
                if (selfRoleMode === 'onetime') {
                  previewDesc += '\n\n**Mode: One-Time Use Only**';
                } else if (selfRoleMode === 'single') {
                  previewDesc += '\n\n**Mode: Single Selection**';
                } else if (selfRoleMode === 'toggle') {
                  previewDesc += '\n\n**Mode: Toggle (Select to Add / Remove)**';
                }

                return (
                  <div>
                    <div className="preview-layout-container">
                      {/* Left Column: Form Controls */}
                      <div style={{
                        flex: '1 1 500px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                      }}>
                        {/* GENERAL SETTINGS */}
                        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Self Roles Dropdown <span style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>Component V2</span>
                              </h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                                Allow members to assign themselves roles using a Discord dropdown select menu.
                              </p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={settings.selfRoles?.enabled || false}
                                onChange={() => handleToggle('selfRoles.enabled')}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          {settings.selfRoles?.enabled && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                              {/* Target Channel */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                                  Target Channel for Self Roles Panel <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <select
                                  value={settings.selfRoles?.channelId || ''}
                                  onChange={(e) => handleInputChange('selfRoles.channelId', e.target.value)}
                                  className="glass-input"
                                >
                                  <option value="">-- Select Channel --</option>
                                  {channels.map(ch => (
                                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Mode Selector */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
                                  Role Selection Mode
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('selfRoles.mode', 'onetime')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: selfRoleMode === 'onetime' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: selfRoleMode === 'onetime' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: selfRoleMode === 'onetime' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: selfRoleMode === 'onetime' ? 'var(--primary)' : 'inherit', fontSize: '0.92rem' }}>🔒 One-Time Use Only</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>User picks once and selection is locked permanently</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('selfRoles.mode', 'single')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: selfRoleMode === 'single' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: selfRoleMode === 'single' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: selfRoleMode === 'single' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: selfRoleMode === 'single' ? 'var(--primary)' : 'inherit', fontSize: '0.92rem' }}>🔘 Single Selection</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Mutually exclusive. Replaces old selection from this menu</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('selfRoles.mode', 'toggle')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: selfRoleMode === 'toggle' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: selfRoleMode === 'toggle' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: selfRoleMode === 'toggle' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: selfRoleMode === 'toggle' ? 'var(--primary)' : 'inherit', fontSize: '0.92rem' }}>🔄 Toggle (Add/Remove)</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Select to give role, select again to remove role</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('selfRoles.mode', 'multi')}
                                    style={{
                                      padding: '12px 14px',
                                      borderRadius: '8px',
                                      border: selfRoleMode === 'multi' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: selfRoleMode === 'multi' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                                      color: selfRoleMode === 'multi' ? '#ffffff' : 'var(--text-secondary)',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span style={{ color: selfRoleMode === 'multi' ? 'var(--primary)' : 'inherit', fontSize: '0.92rem' }}>📋 Multiple Selection</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Select multiple roles at once in the Discord dropdown</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {settings.selfRoles?.enabled && (
                          <>
                            {/* PANEL EMBED & MENU CONFIGURATION */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                PANEL EMBED & MENU CONFIGURATION
                              </span>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Panel Embed Title
                                  </label>
                                  <input
                                    type="text"
                                    value={settings.selfRoles?.title || ''}
                                    onChange={(e) => handleInputChange('selfRoles.title', e.target.value)}
                                    className="glass-input"
                                    placeholder="🍃💨 Self Roles"
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Select Menu Placeholder
                                  </label>
                                  <input
                                    type="text"
                                    value={settings.selfRoles?.placeholder || ''}
                                    onChange={(e) => handleInputChange('selfRoles.placeholder', e.target.value)}
                                    className="glass-input"
                                    placeholder="Make a selection"
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Accent Border Color
                                  </label>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                      type="color"
                                      value={settings.selfRoles?.embedColor || '#2563eb'}
                                      onChange={(e) => handleInputChange('selfRoles.embedColor', e.target.value)}
                                      style={{
                                        width: '38px',
                                        height: '38px',
                                        padding: '0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent'
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={settings.selfRoles?.embedColor || '#2563eb'}
                                      onChange={(e) => handleInputChange('selfRoles.embedColor', e.target.value)}
                                      className="glass-input"
                                      placeholder="#2563eb"
                                      style={{ flex: 1 }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                  Panel Embed Description
                                </label>
                                <textarea
                                  rows="2"
                                  value={settings.selfRoles?.description || ''}
                                  onChange={(e) => handleInputChange('selfRoles.description', e.target.value)}
                                  className="glass-input"
                                  placeholder="Choose your district and find people near you to chat and connect..."
                                />
                              </div>

                              {/* Banner Image Upload & URL input */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
                                      <ImageIcon size={15} color="var(--primary)" />
                                      Panel Banner Image / GIF (Optional)
                                    </label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                                      Upload an image/GIF or paste a media URL to display inside the panel embed.
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                      type="file"
                                      ref={selfRolesImageFileRef}
                                      onChange={handleSelfRolesImageUpload}
                                      accept="image/png, image/jpeg, image/gif, image/webp"
                                      style={{ display: 'none' }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => selfRolesImageFileRef.current?.click()}
                                      disabled={uploadingSelfRolesImage}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                        border: '1px solid rgba(59, 130, 246, 0.35)',
                                        color: '#60a5fa',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: uploadingSelfRolesImage ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      {uploadingSelfRolesImage ? (
                                        <>
                                          <RotateCw size={14} className="spin-animation" />
                                          <span>Uploading...</span>
                                        </>
                                      ) : (
                                        <>
                                          <UploadCloud size={14} />
                                          <span>Upload Image / GIF</span>
                                        </>
                                      )}
                                    </button>

                                    {settings.selfRoles?.imageUrl && (
                                      <button
                                        type="button"
                                        onClick={() => handleInputChange('selfRoles.imageUrl', '')}
                                        title="Remove panel embed image"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                          border: '1px solid rgba(239, 68, 68, 0.25)',
                                          color: '#f87171',
                                          padding: '6px 10px',
                                          borderRadius: '6px',
                                          fontSize: '0.8rem',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 size={14} />
                                        <span>Clear</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    value={settings.selfRoles?.imageUrl || ''}
                                    onChange={(e) => handleInputChange('selfRoles.imageUrl', e.target.value)}
                                    className="glass-input"
                                    placeholder="Paste image link, GIF URL, Tenor/Imgur URL or click Upload"
                                    style={{
                                      backgroundColor: '#07080e',
                                      borderColor: 'rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      color: '#ffffff',
                                      padding: '10px 14px',
                                      fontSize: '0.88rem',
                                      flex: 1
                                    }}
                                  />
                                </div>

                                {settings.selfRoles?.imageUrl && (
                                  <div style={{
                                    marginTop: '6px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    position: 'relative',
                                    maxHeight: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <img
                                      src={resolveUploadUrl(settings.selfRoles.imageUrl)}
                                      alt="Self Roles Banner Preview"
                                      style={{
                                        maxWidth: '100%',
                                        maxHeight: '180px',
                                        objectFit: 'contain'
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '6px',
                                      left: '8px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                      backdropFilter: 'blur(4px)',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.72rem',
                                      color: '#a1a1aa'
                                    }}>
                                      Banner Image Preview
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ROLE OPTIONS BUILDER */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                                    Dropdown Role Options ({currentOptions.length} / 25)
                                  </h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                                    Configure individual options in the dropdown. Each option assigns its customized Discord role.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddOption}
                                  disabled={currentOptions.length >= 25}
                                  className="btn-primary"
                                  style={{
                                    padding: '6px 14px',
                                    fontSize: '0.825rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: currentOptions.length >= 25 ? 0.5 : 1,
                                    cursor: currentOptions.length >= 25 ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <span>+ Add Role Option</span>
                                </button>
                              </div>

                              {/* Option Cards */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {currentOptions.map((opt, index) => (
                                  <div
                                    key={opt.id || index}
                                    style={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                      border: '1px solid rgba(255, 255, 255, 0.08)',
                                      borderRadius: '10px',
                                      padding: '16px',
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                          OPTION #{index + 1}
                                        </span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveOption(index, -1)}
                                            disabled={index === 0}
                                            title="Move Up"
                                            style={{
                                              background: 'rgba(255,255,255,0.05)',
                                              border: '1px solid rgba(255,255,255,0.1)',
                                              color: index === 0 ? '#555' : '#ccc',
                                              borderRadius: '4px',
                                              padding: '2px 6px',
                                              fontSize: '0.7rem',
                                              cursor: index === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                          >
                                            ▲
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveOption(index, 1)}
                                            disabled={index === currentOptions.length - 1}
                                            title="Move Down"
                                            style={{
                                              background: 'rgba(255,255,255,0.05)',
                                              border: '1px solid rgba(255,255,255,0.1)',
                                              color: index === currentOptions.length - 1 ? '#555' : '#ccc',
                                              borderRadius: '4px',
                                              padding: '2px 6px',
                                              fontSize: '0.7rem',
                                              cursor: index === currentOptions.length - 1 ? 'not-allowed' : 'pointer'
                                            }}
                                          >
                                            ▼
                                          </button>
                                        </div>
                                      </div>

                                      {currentOptions.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveOption(index)}
                                          style={{
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                          }}
                                        >
                                          Remove Option
                                        </button>
                                      )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                                      {/* Option Label */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Option Label <span style={{ color: 'var(--danger)' }}>*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={opt.label || ''}
                                          onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                          className="glass-input"
                                          placeholder="e.g. Thiruvananthapuram"
                                        />
                                      </div>

                                      {/* Emoji Picker */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Option Emoji
                                        </label>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                          <input
                                            type="text"
                                            value={opt.emoji || ''}
                                            onChange={(e) => handleOptionChange(index, 'emoji', e.target.value)}
                                            className="glass-input"
                                            placeholder="e.g. 🌴"
                                            style={{ width: '70px', textAlign: 'center' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => openEmojiPicker((emoji) => handleOptionChange(index, 'emoji', emoji))}
                                            style={{
                                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                              border: '1px solid rgba(255, 255, 255, 0.1)',
                                              color: 'var(--text-secondary)',
                                              borderRadius: '6px',
                                              padding: '0 10px',
                                              fontSize: '0.8rem',
                                              cursor: 'pointer',
                                              whiteSpace: 'nowrap'
                                            }}
                                          >
                                            Pick Emoji
                                          </button>
                                        </div>
                                      </div>

                                      {/* Target Discord Role */}
                                      <div>
                                        <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                          Assigned Role <span style={{ color: 'var(--danger)' }}>*</span>
                                        </label>
                                        <select
                                          value={opt.roleId || ''}
                                          onChange={(e) => handleOptionChange(index, 'roleId', e.target.value)}
                                          className="glass-input"
                                        >
                                          <option value="">-- Select Discord Role --</option>
                                          {roles.map(r => (
                                            <option key={r.id} value={r.id} style={{ color: r.color }}>{r.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    {/* Option Description / Subtext */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        Option Subtext / Description (Optional)
                                      </label>
                                      <input
                                        type="text"
                                        value={opt.description || ''}
                                        onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Connect with members from this region"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* PUBLISH PANEL TO DISCORD */}
                            <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', flexWrap: 'wrap', gap: '12px' }}>
                              <div>
                                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>Publish Self Roles Panel to Discord</span>
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                  Send the Self Roles panel with Component V2 Select Menu ({currentOptions.length} role options) directly to the selected channel.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePublishSelfRoles()}
                                disabled={saving || publishingSelfRoles || !settings.selfRoles?.channelId}
                                className="btn-success"
                                style={{
                                  padding: '10px 20px',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  opacity: (!settings.selfRoles?.channelId || saving || publishingSelfRoles) ? 0.6 : 1,
                                  cursor: (!settings.selfRoles?.channelId || saving || publishingSelfRoles) ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {publishingSelfRoles ? (
                                  <>
                                    <RotateCw size={15} className="spin-animation" />
                                    <span>Publishing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={15} />
                                    <span>Publish Embed</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right Column: Live Discord Preview */}
                      <div style={{
                        flex: '1 0 350px',
                        maxWidth: '520px',
                        position: 'sticky',
                        top: '24px',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          <Eye size={14} />
                          Live Discord Preview
                        </span>
                        {settings.selfRoles?.enabled ? (
                          <DiscordMessagePreview
                            botUser={{ username: user?.username }}
                            guildName={guildName}
                            guildIcon={guildIcon}
                            message=""
                            buttonEnabled={false}
                            buttons={[]}
                            selectMenuEnabled={true}
                            selectMenuPlaceholder={settings.selfRoles?.placeholder || 'Make a selection'}
                            selectMenuOptions={currentOptions}
                            embedEnabled={true}
                            embedTitle={settings.selfRoles?.title || '🍃💨 Self Roles'}
                            embedDesc={previewDesc}
                            embedColor={settings.selfRoles?.embedColor || '#2563eb'}
                            embedThumb={guildIcon || ''}
                            embedImage={resolveUploadUrl(settings.selfRoles?.imageUrl || '')}
                            isDM={false}
                          />
                        ) : (
                          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <Award size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Enable the Self Roles system above to see the live Discord Component V2 preview.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 5: ROLES & NICKNAMES */}
              {activeTab === 'roles' && (
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Roles & Nicknames</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Automatically assign roles and structure nickname formatting when members join your server.</p>

                  {/* Auto Role Card */}
                  <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Auto Role on Join</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatically assigns a specific role as soon as a user joins the server.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.autoRole.enabled}
                          onChange={() => handleToggle('autoRole.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.autoRole.enabled && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Role to Auto-Assign</label>
                        <select
                          value={settings.autoRole.roleId}
                          onChange={(e) => handleInputChange('autoRole.roleId', e.target.value)}
                          className="glass-input"
                          style={{ maxWidth: '300px' }}
                        >
                          <option value="">-- Select Role --</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id} style={{ color: role.color }}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Auto Nickname Card */}
                  <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Auto Nickname Formatter</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatically renames new users matching your server nickname format guidelines.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.autoNickname.enabled}
                          onChange={() => handleToggle('autoNickname.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.autoNickname.enabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 'bold' }}>Nickname Template</label>
                          <input
                            type="text"
                            value={settings.autoNickname.template !== undefined ? settings.autoNickname.template : (settings.autoNickname.format || '{DISPLAY_NAME}')}
                            onChange={(e) => {
                              handleInputChange('autoNickname.template', e.target.value);
                              handleInputChange('autoNickname.format', e.target.value); // Sync to format for backward compatibility
                            }}
                            className="glass-input"
                            style={{ maxWidth: '400px' }}
                            placeholder="{DISPLAY_NAME}"
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Use <code>{`{USERNAME}`}</code> or <code>{`{DISPLAY_NAME}`}</code> as placeholders. They will be replaced with each user's chosen source name.
                          </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '600px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 'bold' }}>Source Name</label>
                            <select
                              value={settings.autoNickname.sourceName || 'displayName'}
                              onChange={(e) => handleInputChange('autoNickname.sourceName', e.target.value)}
                              className="glass-input"
                              style={{ width: '100%', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                            >
                              <option value="displayName">Display Name (Nickname)</option>
                              <option value="username">Username</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 'bold' }}>Capitalization Options</label>
                            <select
                              value={settings.autoNickname.casing || 'original'}
                              onChange={(e) => handleInputChange('autoNickname.casing', e.target.value)}
                              className="glass-input"
                              style={{ width: '100%', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                            >
                              <option value="original">Keep Original (e.g. Kallu Shappu)</option>
                              <option value="upper">UPPERCASE (e.g. KALLU SHAPPU)</option>
                              <option value="lower">lowercase (e.g. kallu shappu)</option>
                            </select>
                          </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Live Preview</span>
                          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                            {(() => {
                              const t = settings.autoNickname.template !== undefined ? settings.autoNickname.template : (settings.autoNickname.format || '{DISPLAY_NAME}');
                              const s = settings.autoNickname.sourceName || 'displayName';
                              const c = settings.autoNickname.casing || 'original';
                              const nameSample = 'Kallu Shappu';
                              let formatted = nameSample;
                              if (c === 'upper') formatted = nameSample.toUpperCase();
                              if (c === 'lower') formatted = nameSample.toLowerCase();
                              return t.replace(/\{username\}/gi, formatted).replace(/\{display_name\}/gi, formatted);
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: SERVER AUDIT LOGS */}
              {activeTab === 'logs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Header & Controls Bar */}
                  <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          🛡️ Sidcord Audit Logs
                        </h2>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: '#22c55e',
                          border: '1px solid rgba(34, 197, 94, 0.2)'
                        }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                          Live WebSocket Feed Active
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Real-time audit log stream for bans, kicks, mutes, voice activity, roles, channels, and member actions.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setShowLogSettingsPanel(!showLogSettingsPanel)}
                        className="btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          fontSize: '0.85rem',
                          borderRadius: '8px',
                          backgroundColor: showLogSettingsPanel ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                      >
                        <Settings size={15} />
                        {showLogSettingsPanel ? 'Close Config' : 'Log Channel Config'}
                      </button>

                      <button
                        type="button"
                        onClick={handleExportLogs}
                        disabled={!logs || logs.length === 0}
                        className="btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          fontSize: '0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          cursor: logs && logs.length > 0 ? 'pointer' : 'not-allowed',
                          opacity: logs && logs.length > 0 ? 1 : 0.5
                        }}
                      >
                        <FileText size={15} />
                        Export JSON
                      </button>

                      <button
                        type="button"
                        onClick={handleClearLogs}
                        disabled={clearingLogs || !logs || logs.length === 0}
                        className="btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          fontSize: '0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(244, 63, 94, 0.1)',
                          color: '#f43f5e',
                          border: '1px solid rgba(244, 63, 94, 0.2)',
                          cursor: logs && logs.length > 0 ? 'pointer' : 'not-allowed',
                          opacity: logs && logs.length > 0 ? 1 : 0.5
                        }}
                      >
                        <Trash2 size={15} />
                        {clearingLogs ? 'Clearing...' : 'Clear Logs'}
                      </button>
                    </div>
                  </div>

                  {/* Log Channel & Logging Toggle Configuration Panel */}
                  {showLogSettingsPanel && (
                    <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(37, 99, 235, 0.03)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
                            📢 Discord Server Audit Log Channel Settings
                          </h3>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Select the Discord text channel in your server where audit log embeds will be automatically posted.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        {/* Target Channel Selector */}
                        <div>
                          <label className="form-label" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Hash size={16} /> Audit Log Text Channel
                          </label>
                          <select
                            className="form-control"
                            value={settings?.logging?.logChannelId || ''}
                            onChange={(e) => handleInputChange('logging.logChannelId', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              borderRadius: '8px',
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              border: '1px solid rgba(59, 130, 246, 0.4)',
                              outline: 'none',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}
                          >
                            <option value="" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>-- Disabled (No Channel Selected) --</option>
                            {channels.map(ch => (
                              <option key={ch.id} value={ch.id} style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>#{ch.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleApplyChannelToAllLogs(settings?.logging?.logChannelId)}
                            disabled={!settings?.logging?.logChannelId}
                            style={{
                              marginTop: '8px',
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#3b82f6',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              cursor: settings?.logging?.logChannelId ? 'pointer' : 'not-allowed',
                              width: '100%'
                            }}
                          >
                            ⚡ Send ALL Server Logs to This Text Channel
                          </button>
                        </div>

                        {/* Master Enable Switch */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Enable Audit Logger</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Global toggle for bot audit events</div>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={settings?.logging?.enabled !== false}
                              onChange={() => handleToggle('logging.enabled')}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        Filter Which Events Are Logged:
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        {[
                          { key: 'logBans', label: '🔨 Member Bans & Unbans' },
                          { key: 'logKicks', label: '👢 Member Kicks' },
                          { key: 'logMutes', label: '🔇 Mutes / Timeouts' },
                          { key: 'logVoice', label: '🎤 Voice VC Activity' },
                          { key: 'logRoles', label: '🏷️ Member Role Changes' },
                          { key: 'logChannels', label: '📁 Channel Edits' },
                          { key: 'logMessages', label: '🗑️ Message Deletions' },
                          { key: 'logMembers', label: '📥 Member Joins & Leaves' }
                        ].map(item => (
                          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{item.label}</span>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={settings?.logging?.[item.key] !== false}
                                onChange={() => handleToggle(`logging.${item.key}`)}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={(e) => handleSave(e)}
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: '600' }}
                        >
                          <Check size={16} /> Save Audit Log Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summary Stats Overview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                    <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Logs</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{logs.length}</div>
                    </div>

                    <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(239, 68, 68, 0.02)', borderLeft: '4px solid #ef4444' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Moderation Actions</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>
                        {logs.filter(l => ['ban', 'unban', 'kick', 'timeout', 'untimeout'].includes((l.actionType || '').toLowerCase())).length}
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(59, 130, 246, 0.02)', borderLeft: '4px solid #3b82f6' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Voice Activity</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#3b82f6', marginTop: '4px' }}>
                        {logs.filter(l => (l.actionType || '').toLowerCase().startsWith('voice_')).length}
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(6, 182, 212, 0.02)', borderLeft: '4px solid #06b6d4' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role Changes</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06b6d4', marginTop: '4px' }}>
                        {logs.filter(l => (l.actionType || '').toLowerCase().startsWith('role_')).length}
                      </div>
                    </div>
                  </div>

                  {/* Filter Tabs & Search Bar */}
                  <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    {/* Category Filter Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'ALL', label: 'All Logs' },
                        { id: 'MODERATION', label: '🔨 Moderation' },
                        { id: 'VOICE', label: '🎤 Voice VC' },
                        { id: 'ROLES', label: '🏷️ Roles' },
                        { id: 'CHANNELS', label: '📁 Channels' },
                        { id: 'MESSAGES', label: '💬 Messages & Members' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setLogFilterCategory(tab.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid',
                            borderColor: logFilterCategory === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            backgroundColor: logFilterCategory === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                            color: logFilterCategory === tab.id ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search logs by user or reason..."
                        value={logSearchQuery}
                        onChange={(e) => setLogSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 12px 7px 34px',
                          borderRadius: '20px',
                          fontSize: '0.82rem',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Logs Feed List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto', paddingRight: '6px' }}>
                    {(() => {
                      const filteredLogs = logs.filter(log => {
                        const action = (log.actionType || '').toLowerCase();
                        if (logFilterCategory === 'MODERATION') {
                          if (!['ban', 'unban', 'kick', 'timeout', 'untimeout', 'warn'].includes(action)) return false;
                        } else if (logFilterCategory === 'VOICE') {
                          if (!action.startsWith('voice_')) return false;
                        } else if (logFilterCategory === 'ROLES') {
                          if (!action.startsWith('role_')) return false;
                        } else if (logFilterCategory === 'CHANNELS') {
                          if (!action.startsWith('channel_')) return false;
                        } else if (logFilterCategory === 'MESSAGES') {
                          if (!['message_delete', 'member_join', 'member_leave'].includes(action)) return false;
                        }

                        if (logSearchQuery.trim()) {
                          const q = logSearchQuery.toLowerCase();
                          const modName = log.moderator?.username?.toLowerCase() || '';
                          const targetName = log.target?.username?.toLowerCase() || '';
                          const details = (log.details || '').toLowerCase();
                          return modName.includes(q) || targetName.includes(q) || details.includes(q) || action.includes(q);
                        }
                        return true;
                      });

                      if (filteredLogs.length === 0) {
                        return (
                          <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                            <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: '500' }}>
                              {logs.length === 0 ? 'No audit logs recorded yet. Live monitoring is active.' : 'No audit logs found matching your filters.'}
                            </p>
                          </div>
                        );
                      }

                      return filteredLogs.map((log, idx) => {
                        const info = getLogActionInfo(log.actionType);
                        const modAvatar = (log.moderator && log.moderator.avatar && log.moderator.id)
                          ? `https://cdn.discordapp.com/avatars/${log.moderator.id}/${log.moderator.avatar}.png`
                          : 'https://cdn.discordapp.com/embed/avatars/0.png';

                        const targetAvatar = (log.target && log.target.avatar && log.target.id)
                          ? `https://cdn.discordapp.com/avatars/${log.target.id}/${log.target.avatar}.png`
                          : 'https://cdn.discordapp.com/embed/avatars/0.png';

                        return (
                          <div
                            key={log._id || idx}
                            className="glass-panel"
                            onClick={() => setSelectedLogDetail(log)}
                            style={{
                              padding: '14px 18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '16px',
                              backgroundColor: 'rgba(255,255,255,0.01)',
                              borderLeft: `4px solid ${info.color}`,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexGrow: 1 }}>
                              {/* Avatar stack */}
                              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '54px', height: '32px', flexShrink: 0 }}>
                                <img
                                  src={modAvatar}
                                  alt="Mod"
                                  title={`Executor / Mod: ${log.moderator?.username || 'Unknown Moderator'}`}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--border-color)', position: 'absolute', left: 0, zIndex: 2 }}
                                />
                                <img
                                  src={targetAvatar}
                                  alt="Target"
                                  title={`Target: ${log.target?.username || 'Unknown Target'}`}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${info.color}`, position: 'absolute', left: '18px', zIndex: 1 }}
                                />
                              </div>

                              <div style={{ flexGrow: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ color: 'var(--text-primary)' }}>{log.moderator?.username || 'Unknown Moderator'}</span>
                                  <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>→</span>
                                  <span style={{ color: info.color, fontWeight: '700' }}>{log.target?.username || 'Target User'}</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                                  {log.details}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: '800',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                color: info.color,
                                backgroundColor: info.bg,
                                border: `1px solid ${info.color}33`,
                                letterSpacing: '0.5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>{info.icon}</span>
                                <span>{info.label}</span>
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Unknown Time'}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Log Detail Modal */}
                  {selectedLogDetail && (
                    <div className="modal-backdrop" onClick={() => setSelectedLogDetail(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px', padding: '24px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                            🛡️ Audit Log Entry Details
                          </h3>
                          <button type="button" onClick={() => setSelectedLogDetail(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Action Type: </span>
                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{selectedLogDetail.actionType}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Moderator: </span>
                            <span style={{ fontWeight: '600' }}>{selectedLogDetail.moderator?.username}</span> (ID: {selectedLogDetail.moderator?.id})
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Target: </span>
                            <span style={{ fontWeight: '600' }}>{selectedLogDetail.target?.username}</span> (ID: {selectedLogDetail.target?.id})
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Details: </span>
                            <div>{selectedLogDetail.details}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Timestamp: </span>
                            <div>{selectedLogDetail.timestamp ? new Date(selectedLogDetail.timestamp).toLocaleString() : 'N/A'}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" onClick={() => setSelectedLogDetail(null)}>Close</button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
              {/* TAB 7: BROADCAST DMS */}
              {activeTab === 'broadcast' && (
                <div>

                  <div className="preview-layout-container">
                    {/* Left Column: Form Controls */}
                    <div className="glass-panel" style={{
                      flex: '1 1 500px',
                      padding: '24px',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>



                      {/* Message Textarea */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Message Content</label>
                        <textarea
                          rows="4"
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          maxLength={2000}
                          className="glass-input"
                          placeholder="Hello {username}! Check out our new bot features..."
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Placeholders: Use <code>{`{username}`}</code> to name/mention the member, and <code>{`{server}`}</code> to insert the server name.
                          </span>
                          <span style={{ fontSize: '0.75rem', color: broadcastMessage.length >= 1900 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {broadcastMessage.length} / 2000
                          </span>
                        </div>
                      </div>

                      {/* Multiple Link Buttons Settings panel */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: broadcastButtons.length > 0 ? '16px' : '0' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Attach Link Buttons (Up to 3)</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Adds clickable link buttons at the bottom of the message.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (broadcastButtons.length < 3) {
                                setBroadcastButtons([...broadcastButtons, { label: '', url: '' }]);
                              }
                            }}
                            disabled={broadcastButtons.length >= 3}
                            className="btn-success"
                            style={{ padding: '4px 10px', fontSize: '0.8rem', opacity: broadcastButtons.length >= 3 ? 0.5 : 1, cursor: broadcastButtons.length >= 3 ? 'not-allowed' : 'pointer' }}
                          >
                            + Add Button
                          </button>
                        </div>

                        {broadcastButtons.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {broadcastButtons.map((btn, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button {idx + 1} Label</label>
                                  <input
                                    type="text"
                                    value={btn.label}
                                    onChange={(e) => {
                                      const updated = [...broadcastButtons];
                                      updated[idx].label = e.target.value;
                                      setBroadcastButtons(updated);
                                    }}
                                    className="glass-input"
                                    placeholder="e.g. Website"
                                  />
                                </div>
                                <div style={{ flex: 2 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button {idx + 1} URL</label>
                                  <input
                                    type="text"
                                    value={btn.url}
                                    onChange={(e) => {
                                      const updated = [...broadcastButtons];
                                      updated[idx].url = e.target.value;
                                      setBroadcastButtons(updated);
                                    }}
                                    className="glass-input"
                                    placeholder="e.g. https://website.com"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBroadcastButtons(broadcastButtons.filter((_, i) => i !== idx));
                                  }}
                                  className="btn-danger"
                                  style={{ padding: '8px 12px', fontSize: '0.85rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Legacy fallback toggle to show one single button if none are explicitly in the array */
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quick Button Toggle</span>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={broadcastButtonEnabled}
                                  onChange={(e) => setBroadcastButtonEnabled(e.target.checked)}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                            {broadcastButtonEnabled && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button Label</label>
                                  <input
                                    type="text"
                                    value={broadcastButtonLabel}
                                    onChange={(e) => setBroadcastButtonLabel(e.target.value)}
                                    className="glass-input"
                                    placeholder="e.g. Visit Website"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button URL</label>
                                  <input
                                    type="text"
                                    value={broadcastButtonUrl}
                                    onChange={(e) => setBroadcastButtonUrl(e.target.value)}
                                    className="glass-input"
                                    placeholder="e.g. https://website.com"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Embed Builder sub-panel */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: broadcastEmbedEnabled ? '16px' : '0' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Attach Rich Embed</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Creates a beautifully styled embed card with custom color, title, and media links.</p>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={broadcastEmbedEnabled}
                              onChange={(e) => setBroadcastEmbedEnabled(e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        {broadcastEmbedEnabled && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Author Customization */}
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Customize Embed Author</span>
                                <label className="switch" style={{ width: '40px', height: '20px' }}>
                                  <input
                                    type="checkbox"
                                    checked={broadcastEmbedAuthorEnabled}
                                    onChange={(e) => setBroadcastEmbedAuthorEnabled(e.target.checked)}
                                  />
                                  <span className="slider" style={{ borderRadius: '20px' }}></span>
                                </label>
                              </div>
                              {broadcastEmbedAuthorEnabled && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author Name</label>
                                      <input
                                        type="text"
                                        value={broadcastEmbedAuthorName}
                                        onChange={(e) => setBroadcastEmbedAuthorName(e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Server Owner"
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author Icon URL</label>
                                      <input
                                        type="text"
                                        value={broadcastEmbedAuthorIcon}
                                        onChange={(e) => setBroadcastEmbedAuthorIcon(e.target.value)}
                                        className="glass-input"
                                        placeholder="https://example.com/icon.png"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author Click URL</label>
                                    <input
                                      type="text"
                                      value={broadcastEmbedAuthorUrl}
                                      onChange={(e) => setBroadcastEmbedAuthorUrl(e.target.value)}
                                      className="glass-input"
                                      placeholder="https://example.com"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Embed Title & Sidebar Color */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Embed Title</label>
                                <input
                                  type="text"
                                  value={broadcastEmbedTitle}
                                  onChange={(e) => setBroadcastEmbedTitle(e.target.value)}
                                  className="glass-input"
                                  placeholder="Embed Title"
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sidebar Color</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input
                                    type="color"
                                    value={broadcastEmbedColor}
                                    onChange={(e) => setBroadcastEmbedColor(e.target.value)}
                                    style={{ width: '40px', height: '40px', padding: '0', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                  />
                                  <input
                                    type="text"
                                    value={broadcastEmbedColor}
                                    onChange={(e) => setBroadcastEmbedColor(e.target.value)}
                                    className="glass-input"
                                    placeholder="#2563eb"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Embed Description */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Embed Description</label>
                              <textarea
                                rows="3"
                                value={broadcastEmbedDesc}
                                onChange={(e) => setBroadcastEmbedDesc(e.target.value)}
                                maxLength={4000}
                                className="glass-input"
                                placeholder="Rich description..."
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: broadcastEmbedDesc.length >= 3800 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                  {broadcastEmbedDesc.length} / 4000
                                </span>
                              </div>
                            </div>

                            {/* Embed Fields Section */}
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Embed Fields (Up to 5)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (broadcastEmbedFields.length < 5) {
                                      setBroadcastEmbedFields([...broadcastEmbedFields, { name: '', value: '', inline: true }]);
                                    }
                                  }}
                                  disabled={broadcastEmbedFields.length >= 5}
                                  className="btn-primary"
                                  style={{ padding: '4px 10px', fontSize: '0.8rem', opacity: broadcastEmbedFields.length >= 5 ? 0.5 : 1, cursor: broadcastEmbedFields.length >= 5 ? 'not-allowed' : 'pointer' }}
                                >
                                  + Add Field
                                </button>
                              </div>

                              {broadcastEmbedFields.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                  {broadcastEmbedFields.map((fld, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Field #{idx + 1}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <input
                                              type="checkbox"
                                              checked={fld.inline}
                                              onChange={(e) => {
                                                const updated = [...broadcastEmbedFields];
                                                updated[idx].inline = e.target.checked;
                                                setBroadcastEmbedFields(updated);
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            />
                                            Inline Grid Layout
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setBroadcastEmbedFields(broadcastEmbedFields.filter((_, i) => i !== idx));
                                            }}
                                            className="btn-danger"
                                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>

                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                                        <div>
                                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Field Name</label>
                                          <input
                                            type="text"
                                            value={fld.name}
                                            onChange={(e) => {
                                              const updated = [...broadcastEmbedFields];
                                              updated[idx].name = e.target.value;
                                              setBroadcastEmbedFields(updated);
                                            }}
                                            className="glass-input"
                                            placeholder="Field Title"
                                          />
                                        </div>
                                        <div>
                                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Field Value</label>
                                          <textarea
                                            rows="1"
                                            value={fld.value}
                                            onChange={(e) => {
                                              const updated = [...broadcastEmbedFields];
                                              updated[idx].value = e.target.value;
                                              setBroadcastEmbedFields(updated);
                                            }}
                                            className="glass-input"
                                            placeholder="Field Content"
                                            style={{ minHeight: '38px', resize: 'vertical' }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Embed Thumbnail & Image */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thumbnail URL</label>
                                <input
                                  type="text"
                                  value={broadcastEmbedThumb}
                                  onChange={(e) => setBroadcastEmbedThumb(e.target.value)}
                                  className="glass-input"
                                  placeholder="https://example.com/thumbnail.png"
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Large Image URL</label>
                                <input
                                  type="text"
                                  value={broadcastEmbedImage}
                                  onChange={(e) => setBroadcastEmbedImage(e.target.value)}
                                  className="glass-input"
                                  placeholder="https://example.com/banner.png"
                                />
                              </div>
                            </div>

                            {/* Footer Customization */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Customize Embed Footer</span>
                                <label className="switch" style={{ width: '40px', height: '20px' }}>
                                  <input
                                    type="checkbox"
                                    checked={broadcastEmbedFooterEnabled}
                                    onChange={(e) => setBroadcastEmbedFooterEnabled(e.target.checked)}
                                  />
                                  <span className="slider" style={{ borderRadius: '20px' }}></span>
                                </label>
                              </div>
                              {broadcastEmbedFooterEnabled && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Footer Text</label>
                                    <input
                                      type="text"
                                      value={broadcastEmbedFooterText}
                                      onChange={(e) => setBroadcastEmbedFooterText(e.target.value)}
                                      className="glass-input"
                                      placeholder="Footer Text"
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Footer Icon URL</label>
                                    <input
                                      type="text"
                                      value={broadcastEmbedFooterIcon}
                                      onChange={(e) => setBroadcastEmbedFooterIcon(e.target.value)}
                                      className="glass-input"
                                      placeholder="https://example.com/footer-icon.png"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template Manager Section */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0' }}>Save or Load Templates</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              value={templateName}
                              onChange={(e) => setTemplateName(e.target.value)}
                              className="glass-input"
                              placeholder="Template Name (e.g. Promo DM)"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (templateName.trim()) {
                                handleSaveTemplate(templateName, 'dm');
                                setTemplateName('');
                              }
                            }}
                            className="btn-success"
                            style={{ height: '40px', padding: '0 16px', fontSize: '0.85rem' }}
                          >
                            Save Draft
                          </button>
                        </div>

                        {templates.length > 0 && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Saved DM Templates</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {templates.map(tpl => (
                                <div key={tpl._id} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                  <span
                                    onClick={() => handleLoadTemplate(tpl)}
                                    style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                                  >
                                    {tpl.name}
                                  </span>
                                  <Trash2
                                    size={12}
                                    style={{ color: 'var(--danger)', cursor: 'pointer' }}
                                    onClick={() => handleDeleteTemplate(tpl._id, 'dm')}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delivery & Scheduling Settings */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0', color: '#ffffff' }}>Delivery & Scheduling Settings</h4>

                        {/* Delay Slider */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Stagger Interval Delay: <strong style={{ color: 'var(--primary)' }}>{broadcastDelayInterval} second{broadcastDelayInterval !== 1 ? 's' : ''}</strong>
                            </label>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protects against API rate limits</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={broadcastDelayInterval}
                            onChange={(e) => setBroadcastDelayInterval(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                          />
                        </div>

                        {/* Scheduling Toggle & Input */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: broadcastIsScheduled ? '12px' : '0' }}>
                            <div>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Schedule Broadcast for Later</span>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Queue this broadcast to run at a specific future date and time.</p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={broadcastIsScheduled}
                                onChange={(e) => setBroadcastIsScheduled(e.target.checked)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          {broadcastIsScheduled && (
                            <div style={{ marginTop: '12px' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Release Date & Time</label>
                              <input
                                type="datetime-local"
                                value={broadcastScheduledTime}
                                onChange={(e) => setBroadcastScheduledTime(e.target.value)}
                                className="glass-input"
                                style={{ colorScheme: 'dark' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mass DM Warning Banner */}
                      <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <h4 style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '4px' }}>⚠️ Mass DM rate limit & safety warning</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                          The bot sends direct messages to members using a **{broadcastDelayInterval}-second interval** to protect your bot from getting flagged as spam. Please be patient while the broadcast runs in the background.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <button
                          type="button"
                          onClick={handleSendTestDM}
                          disabled={broadcasting}
                          className="btn-secondary"
                          style={{ gap: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '42px', padding: '0 16px', fontSize: '0.85rem' }}
                        >
                          <Eye size={18} />
                          Send Test DM
                        </button>
                        <button
                          type="button"
                          onClick={handleSendBroadcast}
                          disabled={broadcasting}
                          className="btn-primary pulse-glow"
                          style={{ gap: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '42px', padding: '0 20px', fontSize: '0.85rem' }}
                        >
                          <Send size={18} />
                          {broadcasting ? 'Broadcasting DMs...' : (broadcastIsScheduled ? 'Schedule DM Broadcast' : 'Send DMs to Members')}
                        </button>
                      </div>

                      {/* Pending Scheduled DMs List */}
                      {scheduledDMs.length > 0 && (
                        <div className="glass-panel" style={{ padding: '16px', borderColor: 'var(--primary)', backgroundColor: 'rgba(59, 130, 246, 0.02)', marginTop: '20px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0', color: '#ffffff' }}>Pending Scheduled DMs ({scheduledDMs.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {scheduledDMs.map(dm => {
                              return (
                                <div key={dm._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                  <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                                      {dm.message || (dm.embed && dm.embed.title) || 'Embed Only DM'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Publishing at {new Date(dm.publishAt).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Delay: {dm.delayInterval}s | Roles: Filter: {roles.find(r => r.id === dm.filterRole)?.name || 'None'} / Exclude: {roles.find(r => r.id === dm.excludeRole)?.name || 'None'}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteScheduledDM(dm._id)}
                                    className="btn-danger"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}



                    </div>

                    {/* Right Column: Live Discord Preview */}
                    <div style={{
                      flex: '1 0 350px',
                      maxWidth: '520px',
                      position: 'sticky',
                      top: '24px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <Eye size={14} />
                        Live Discord Preview
                      </span>
                      <DiscordMessagePreview
                        botUser={{ username: user?.username }}
                        guildName={guildName}
                        guildIcon={guildIcon}
                        message={broadcastMessage}
                        buttonEnabled={broadcastButtonEnabled}
                        buttonLabel={broadcastButtonLabel}
                        buttonUrl={broadcastButtonUrl}
                        embedEnabled={broadcastEmbedEnabled}
                        embedTitle={broadcastEmbedTitle}
                        embedDesc={broadcastEmbedDesc}
                        embedColor={broadcastEmbedColor}
                        embedThumb={broadcastEmbedThumb}
                        embedImage={broadcastEmbedImage}
                        isDM={true}
                        embedAuthorEnabled={broadcastEmbedAuthorEnabled}
                        embedAuthorName={broadcastEmbedAuthorName}
                        embedAuthorIcon={broadcastEmbedAuthorIcon}
                        embedAuthorUrl={broadcastEmbedAuthorUrl}
                        embedFooterEnabled={broadcastEmbedFooterEnabled}
                        embedFooterText={broadcastEmbedFooterText}
                        embedFooterIcon={broadcastEmbedFooterIcon}
                        embedFields={broadcastEmbedFields}
                        buttons={broadcastButtons.length > 0 ? broadcastButtons : (broadcastButtonEnabled && broadcastButtonLabel && broadcastButtonUrl ? [{ label: broadcastButtonLabel, url: broadcastButtonUrl }] : [])}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: PUBLISH ANNOUNCEMENT */}
              {activeTab === 'publish' && (
                <div>

                  <div className="preview-layout-container">
                    {/* Left Column: Form Controls */}
                    <div className="glass-panel" style={{
                      flex: '1 1 500px',
                      padding: '24px',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>

                      {/* Emoji Tip Banner */}
                      <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#93c5fd', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} style={{ flexShrink: 0 }} />
                        <span>
                          <strong>Emoji Compatibility:</strong> Standard Emojis (😀, 🔥, 🚀, ✨) work in all fields including Embed Titles & Footers. Custom Server Emojis work in Message Content, Embed Description, Fields & Buttons on Discord.
                        </span>
                      </div>

                      {/* Target Channel & Ping Target Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {/* Target Channel Dropdown */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Select Target Channel</label>
                          <select
                            value={pubChannelId}
                            onChange={(e) => setPubChannelId(e.target.value)}
                            className="glass-input"
                          >
                            <option value="">-- Select text channel --</option>
                            {channels.map(ch => (
                              <option key={ch.id} value={ch.id}>#{ch.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Ping Target Select */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Ping Target (Mentions)</label>
                          <select
                            value={pubPingType}
                            onChange={(e) => setPubPingType(e.target.value)}
                            className="glass-input"
                          >
                            <option value="none">No Mention</option>
                            <option value="everyone">@everyone</option>
                            <option value="here">@here</option>
                            <option value="role">Specific Role...</option>
                          </select>
                        </div>
                      </div>

                      {/* Specific Role Dropdown */}
                      {pubPingType === 'role' && (
                        <div style={{ marginTop: '-4px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Select Role to Ping</label>
                          <select
                            value={pubPingRoleId}
                            onChange={(e) => setPubPingRoleId(e.target.value)}
                            className="glass-input"
                          >
                            <option value="">-- Select server role --</option>
                            {roles.map(r => (
                              <option key={r.id} value={r.id} style={{ color: r.color }}>{r.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Message Textarea */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Message Content</label>
                          <button
                            type="button"
                            onClick={() => openEmojiPicker((emoji) => setPubMessage(prev => prev + emoji))}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            😊 Pick Emoji
                          </button>
                        </div>
                        <textarea
                          rows="4"
                          value={pubMessage}
                          onChange={(e) => setPubMessage(e.target.value)}
                          maxLength={2000}
                          className="glass-input"
                          placeholder="Type your channel message here..."
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Placeholders: Use <code>{`{server}`}</code> to insert the server name.
                          </span>
                          <span style={{ fontSize: '0.75rem', color: pubMessage.length >= 1900 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {pubMessage.length} / 2000
                          </span>
                        </div>
                      </div>

                      {/* Multiple Link Buttons Settings panel */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pubButtons.length > 0 ? '16px' : '0' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Attach Link Buttons (Up to 3)</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Adds clickable link buttons at the bottom of the message.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (pubButtons.length < 3) {
                                setPubButtons([...pubButtons, { label: '', url: '' }]);
                              }
                            }}
                            disabled={pubButtons.length >= 3}
                            className="btn-success"
                            style={{ padding: '4px 10px', fontSize: '0.8rem', opacity: pubButtons.length >= 3 ? 0.5 : 1, cursor: pubButtons.length >= 3 ? 'not-allowed' : 'pointer' }}
                          >
                            + Add Button
                          </button>
                        </div>

                        {pubButtons.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {pubButtons.map((btn, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Button {idx + 1} Label</label>
                                    <button
                                      type="button"
                                      onClick={() => openEmojiPicker((emoji) => {
                                        const updated = [...pubButtons];
                                        updated[idx].label = (updated[idx].label || '') + emoji;
                                        setPubButtons(updated);
                                      })}
                                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                    >
                                      😊
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={btn.label}
                                    onChange={(e) => {
                                      const updated = [...pubButtons];
                                      updated[idx].label = e.target.value;
                                      setPubButtons(updated);
                                    }}
                                    className="glass-input"
                                    placeholder="e.g. Website"
                                  />
                                </div>
                                <div style={{ flex: 2 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button {idx + 1} URL</label>
                                  <input
                                    type="text"
                                    value={btn.url}
                                    onChange={(e) => {
                                      const updated = [...pubButtons];
                                      updated[idx].url = e.target.value;
                                      setPubButtons(updated);
                                    }}
                                    className="glass-input"
                                    placeholder="e.g. https://website.com"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPubButtons(pubButtons.filter((_, i) => i !== idx));
                                  }}
                                  className="btn-danger"
                                  style={{ padding: '8px 12px', fontSize: '0.85rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Legacy fallback toggle to show one single button if none are explicitly in the array */
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quick Button Toggle</span>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={pubButtonEnabled}
                                  onChange={(e) => setPubButtonEnabled(e.target.checked)}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                            {pubButtonEnabled && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Button Label</label>
                                    <button
                                      type="button"
                                      onClick={() => openEmojiPicker((emoji) => setPubButtonLabel(prev => prev + emoji))}
                                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                    >
                                      😊
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={pubButtonLabel}
                                    onChange={(e) => setPubButtonLabel(e.target.value)}
                                    className="glass-input"
                                    placeholder="e.g. Visit Website"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Button URL</label>
                                  <input
                                    type="text"
                                    value={pubButtonUrl}
                                    onChange={(e) => setPubButtonUrl(e.target.value)}
                                    className="glass-input"
                                    placeholder="e.g. https://website.com"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Embed Builder sub-panel */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pubEmbedEnabled ? '16px' : '0' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Attach Rich Embed</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Creates a beautifully styled embed card with custom color, title, and media links.</p>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={pubEmbedEnabled}
                              onChange={(e) => setPubEmbedEnabled(e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        {pubEmbedEnabled && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Author customization */}
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Customize Embed Author</span>
                                <label className="switch" style={{ width: '40px', height: '20px' }}>
                                  <input
                                    type="checkbox"
                                    checked={pubEmbedAuthorEnabled}
                                    onChange={(e) => setPubEmbedAuthorEnabled(e.target.checked)}
                                  />
                                  <span className="slider" style={{ borderRadius: '20px' }}></span>
                                </label>
                              </div>
                              {pubEmbedAuthorEnabled && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                                    <div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Author Name</label>
                                        <button
                                          type="button"
                                          onClick={() => openEmojiPicker((emoji) => setPubEmbedAuthorName(prev => prev + emoji))}
                                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                        >
                                          😊
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        value={pubEmbedAuthorName}
                                        onChange={(e) => setPubEmbedAuthorName(e.target.value)}
                                        className="glass-input"
                                        placeholder="e.g. Server Owner"
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author Icon URL</label>
                                      <input
                                        type="text"
                                        value={pubEmbedAuthorIcon}
                                        onChange={(e) => setPubEmbedAuthorIcon(e.target.value)}
                                        className="glass-input"
                                        placeholder="https://example.com/icon.png"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author Click URL</label>
                                    <input
                                      type="text"
                                      value={pubEmbedAuthorUrl}
                                      onChange={(e) => setPubEmbedAuthorUrl(e.target.value)}
                                      className="glass-input"
                                      placeholder="https://example.com"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Embed Title & Color */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Embed Title</label>
                                  <button
                                    type="button"
                                    onClick={() => openEmojiPicker((emoji) => setPubEmbedTitle(prev => prev + emoji))}
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                  >
                                    😊 Pick Emoji
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={pubEmbedTitle}
                                  onChange={(e) => setPubEmbedTitle(e.target.value)}
                                  className="glass-input"
                                  placeholder="Embed Title"
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sidebar Color</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input
                                    type="color"
                                    value={pubEmbedColor}
                                    onChange={(e) => setPubEmbedColor(e.target.value)}
                                    style={{ width: '40px', height: '40px', padding: '0', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                  />
                                  <input
                                    type="text"
                                    value={pubEmbedColor}
                                    onChange={(e) => setPubEmbedColor(e.target.value)}
                                    className="glass-input"
                                    placeholder="#2563eb"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Embed Description */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Embed Description</label>
                                <button
                                  type="button"
                                  onClick={() => openEmojiPicker((emoji) => setPubEmbedDesc(prev => prev + emoji))}
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                >
                                  😊 Pick Emoji
                                </button>
                              </div>
                              <textarea
                                rows="3"
                                value={pubEmbedDesc}
                                onChange={(e) => setPubEmbedDesc(e.target.value)}
                                maxLength={4000}
                                className="glass-input"
                                placeholder="Rich description..."
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: pubEmbedDesc.length >= 3800 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                  {pubEmbedDesc.length} / 4000
                                </span>
                              </div>
                            </div>

                            {/* Embed Fields Section */}
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Embed Fields (Up to 5)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (pubEmbedFields.length < 5) {
                                      setPubEmbedFields([...pubEmbedFields, { name: '', value: '', inline: true }]);
                                    }
                                  }}
                                  disabled={pubEmbedFields.length >= 5}
                                  className="btn-primary"
                                  style={{ padding: '4px 10px', fontSize: '0.8rem', opacity: pubEmbedFields.length >= 5 ? 0.5 : 1, cursor: pubEmbedFields.length >= 5 ? 'not-allowed' : 'pointer' }}
                                >
                                  + Add Field
                                </button>
                              </div>

                              {pubEmbedFields.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                  {pubEmbedFields.map((fld, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Field #{idx + 1}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <input
                                              type="checkbox"
                                              checked={fld.inline}
                                              onChange={(e) => {
                                                const updated = [...pubEmbedFields];
                                                updated[idx].inline = e.target.checked;
                                                setPubEmbedFields(updated);
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            />
                                            Inline Grid Layout
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setPubEmbedFields(pubEmbedFields.filter((_, i) => i !== idx));
                                            }}
                                            className="btn-danger"
                                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>

                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                                        <div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Field Name</label>
                                            <button
                                              type="button"
                                              onClick={() => openEmojiPicker((emoji) => {
                                                const updated = [...pubEmbedFields];
                                                updated[idx].name = (updated[idx].name || '') + emoji;
                                                setPubEmbedFields(updated);
                                              })}
                                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                            >
                                              😊
                                            </button>
                                          </div>
                                          <input
                                            type="text"
                                            value={fld.name}
                                            onChange={(e) => {
                                              const updated = [...pubEmbedFields];
                                              updated[idx].name = e.target.value;
                                              setPubEmbedFields(updated);
                                            }}
                                            className="glass-input"
                                            placeholder="Field Title (e.g. Server Rules)"
                                          />
                                        </div>
                                        <div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Field Value</label>
                                            <button
                                              type="button"
                                              onClick={() => openEmojiPicker((emoji) => {
                                                const updated = [...pubEmbedFields];
                                                updated[idx].value = (updated[idx].value || '') + emoji;
                                                setPubEmbedFields(updated);
                                              })}
                                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                            >
                                              😊
                                            </button>
                                          </div>
                                          <textarea
                                            rows="1"
                                            value={fld.value}
                                            onChange={(e) => {
                                              const updated = [...pubEmbedFields];
                                              updated[idx].value = e.target.value;
                                              setPubEmbedFields(updated);
                                            }}
                                            className="glass-input"
                                            placeholder="Field Content"
                                            style={{ minHeight: '38px', resize: 'vertical' }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Embed Thumbnail & Image */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thumbnail URL</label>
                                <input
                                  type="text"
                                  value={pubEmbedThumb}
                                  onChange={(e) => setPubEmbedThumb(e.target.value)}
                                  className="glass-input"
                                  placeholder="https://example.com/thumbnail.png"
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Large Image / GIF URL</label>
                                <input
                                  type="text"
                                  value={pubEmbedImage}
                                  onChange={(e) => setPubEmbedImage(e.target.value)}
                                  className="glass-input"
                                  placeholder="https://example.com/banner.png or GIF URL"
                                />
                              </div>
                            </div>

                            {/* Footer customization */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Customize Embed Footer</span>
                                <label className="switch" style={{ width: '40px', height: '20px' }}>
                                  <input
                                    type="checkbox"
                                    checked={pubEmbedFooterEnabled}
                                    onChange={(e) => setPubEmbedFooterEnabled(e.target.checked)}
                                  />
                                  <span className="slider" style={{ borderRadius: '20px' }}></span>
                                </label>
                              </div>
                              {pubEmbedFooterEnabled && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Footer Text</label>
                                      <button
                                        type="button"
                                        onClick={() => openEmojiPicker((emoji) => setPubEmbedFooterText(prev => prev + emoji))}
                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                      >
                                        😊
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={pubEmbedFooterText}
                                      onChange={(e) => setPubEmbedFooterText(e.target.value)}
                                      className="glass-input"
                                      placeholder="Footer Text"
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Footer Icon URL</label>
                                    <input
                                      type="text"
                                      value={pubEmbedFooterIcon}
                                      onChange={(e) => setPubEmbedFooterIcon(e.target.value)}
                                      className="glass-input"
                                      placeholder="https://example.com/footer-icon.png"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template Manager Section */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0' }}>Save or Load Templates</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              value={templateName}
                              onChange={(e) => setTemplateName(e.target.value)}
                              className="glass-input"
                              placeholder="Template Name (e.g. Rules Post)"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (templateName.trim()) {
                                handleSaveTemplate(templateName, 'announcement');
                                setTemplateName('');
                              }
                            }}
                            className="btn-success"
                            style={{ height: '40px', padding: '0 16px', fontSize: '0.85rem' }}
                          >
                            Save Draft
                          </button>
                        </div>

                        {templates.length > 0 && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Saved Announcement Templates</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {templates.map(tpl => (
                                <div key={tpl._id} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                  <span
                                    onClick={() => handleLoadTemplate(tpl)}
                                    style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                                  >
                                    {tpl.name}
                                  </span>
                                  <Trash2
                                    size={12}
                                    style={{ color: 'var(--danger)', cursor: 'pointer' }}
                                    onClick={() => handleDeleteTemplate(tpl._id, 'announcement')}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Scheduled Announcement Options */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isScheduled ? '16px' : '0' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Schedule Publication</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Publish this announcement automatically at a future date & time.</p>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isScheduled}
                              onChange={(e) => setIsScheduled(e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        {isScheduled && (
                          <div style={{ marginTop: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Select Release Date & Time</label>
                            <input
                              type="datetime-local"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="glass-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Pending Scheduled Announcements List */}
                      {scheduledAnnouncements.length > 0 && (
                        <div className="glass-panel" style={{ padding: '16px', borderColor: 'var(--primary)', backgroundColor: 'rgba(59, 130, 246, 0.02)' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0', color: '#ffffff' }}>Pending Scheduled Announcements ({scheduledAnnouncements.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {scheduledAnnouncements.map(ann => {
                              const targetCh = channels.find(c => c.id === ann.channelId)?.name || 'unknown-channel';
                              return (
                                <div key={ann._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                  <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>#{targetCh}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Publishing at {new Date(ann.publishAt).toLocaleString()}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteScheduledAnnouncement(ann._id)}
                                    className="btn-danger"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <button
                          type="button"
                          onClick={handleSendChannelMessage}
                          disabled={publishing}
                          className="btn-primary pulse-glow"
                          style={{ gap: '10px' }}
                        >
                          <Send size={18} />
                          {publishing ? (isScheduled ? 'Scheduling...' : 'Publishing...') : (isScheduled ? 'Schedule Announcement' : 'Publish Announcement')}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Live Discord Preview */}
                    <div style={{
                      flex: '1 0 350px',
                      maxWidth: '520px',
                      position: 'sticky',
                      top: '24px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <Eye size={14} />
                        Live Discord Preview
                      </span>
                      <DiscordMessagePreview
                        botUser={{ username: user?.username }}
                        guildName={guildName}
                        guildIcon={guildIcon}
                        message={pubMessage}
                        buttonEnabled={pubButtonEnabled}
                        buttonLabel={pubButtonLabel}
                        buttonUrl={pubButtonUrl}
                        embedEnabled={pubEmbedEnabled}
                        embedTitle={pubEmbedTitle}
                        embedDesc={pubEmbedDesc}
                        embedColor={pubEmbedColor}
                        embedThumb={pubEmbedThumb}
                        embedImage={pubEmbedImage}
                        isDM={false}
                        pingType={pubPingType}
                        pingRoleId={pubPingRoleId}
                        roles={roles}
                        embedAuthorEnabled={pubEmbedAuthorEnabled}
                        embedAuthorName={pubEmbedAuthorName}
                        embedAuthorIcon={pubEmbedAuthorIcon}
                        embedAuthorUrl={pubEmbedAuthorUrl}
                        embedFooterEnabled={pubEmbedFooterEnabled}
                        embedFooterText={pubEmbedFooterText}
                        embedFooterIcon={pubEmbedFooterIcon}
                        embedFields={pubEmbedFields}
                        buttons={pubButtons.length > 0 ? pubButtons : (pubButtonEnabled && pubButtonLabel && pubButtonUrl ? [{ label: pubButtonLabel, url: pubButtonUrl }] : [])}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8.5: YOUTUBE ANNOUNCEMENTS */}
              {activeTab === 'youtube' && settings && (
                <div>

                  <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>YouTube Upload Notifications</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle the automated YouTube uploader checker system.</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={settings.youtube?.enabled || false}
                          onChange={() => handleToggle('youtube.enabled')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    {settings.youtube?.enabled && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Channel URL connection row */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            YouTube Channel URL or Handle <span style={{ color: 'var(--danger)' }}>*</span>
                          </label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                              type="text"
                              value={settings.youtube?.channelUrl || ''}
                              onChange={(e) => handleInputChange('youtube.channelUrl', e.target.value)}
                              className="glass-input"
                              placeholder="e.g. @kallushappu or https://youtube.com/channel/UC..."
                            />
                            <button
                              type="button"
                              onClick={handleResolveYoutubeChannel}
                              disabled={resolvingChannel || !settings.youtube?.channelUrl}
                              className="btn-primary"
                              style={{ whiteSpace: 'nowrap', minWidth: '130px', justifyContent: 'center' }}
                            >
                              {resolvingChannel ? 'Connecting...' : 'Connect Channel'}
                            </button>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                            Enter your YouTube custom handle (with @) or the full channel URL, then click Connect.
                          </span>
                        </div>

                        {/* Resolved Connection Status Banner */}
                        {settings.youtube?.channelId && (
                          <div className="glass-panel" style={{
                            padding: '12px 16px',
                            backgroundColor: 'rgba(37, 99, 235, 0.05)',
                            borderColor: 'rgba(37, 99, 235, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                              <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>
                                Connected Channel: <strong style={{ color: 'white' }}>{settings.youtube?.channelName || 'YouTube Channel'}</strong>
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                              ID: {settings.youtube?.channelId}
                            </span>
                          </div>
                        )}

                        {resolveSuccessMsg && (
                          <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '500' }}>
                            {resolveSuccessMsg}
                          </div>
                        )}

                        {/* Dropdown Configuration fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

                          {/* Discord Channel Dropdown */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                              Announcement Discord Channel <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <select
                              value={settings.youtube?.targetChannelId || ''}
                              onChange={(e) => handleInputChange('youtube.targetChannelId', e.target.value)}
                              className="glass-input"
                            >
                              <option value="">-- Select Discord Channel --</option>
                              {channels.map(ch => (
                                <option key={ch.id} value={ch.id}>#{ch.name}</option>
                              ))}
                            </select>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                              The channel where upload announcements will be published.
                            </span>
                          </div>

                          {/* Ping Mention Role Dropdown */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                              Mention Role (Ping)
                            </label>
                            <select
                              value={settings.youtube?.pingRoleId || ''}
                              onChange={(e) => handleInputChange('youtube.pingRoleId', e.target.value)}
                              className="glass-input"
                            >
                              <option value="">-- None --</option>
                              <option value="everyone">@everyone</option>
                              <option value="here">@here</option>
                              {roles.map(role => (
                                <option key={role.id} value={role.id} style={{ color: role.color }}>@{role.name}</option>
                              ))}
                            </select>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                              Optional role to mention/ping when announcing new videos.
                            </span>
                          </div>

                        </div>

                        {/* Announcement Message Template */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Video Upload Message Template
                          </label>
                          <textarea
                            value={settings.youtube?.messageTemplate || ''}
                            onChange={(e) => handleInputChange('youtube.messageTemplate', e.target.value)}
                            className="glass-input"
                            style={{ minHeight: '90px', fontFamily: 'monospace', fontSize: '0.9rem' }}
                            placeholder="{url}"
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                            Available Placeholders: <code>{`{channel}`}</code> (YouTube Channel Name), <code>{`{title}`}</code> (Video Title), <code>{`{url}`}</code> (Video Link).
                          </span>
                        </div>

                        {/* Custom Discord Live Preview */}
                        <div style={{ marginTop: '10px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            Live Discord Announcement Preview
                          </label>

                          <div style={{
                            backgroundColor: '#313338',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                            color: '#dbdee1',
                            fontSize: '0.9375rem',
                            lineHeight: '1.375rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            width: '100%',
                            maxWidth: '520px'
                          }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                              <img
                                src={user?.avatar
                                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                                  : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                alt=""
                                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: '600', color: '#f2f3f5', fontSize: '0.95rem' }}>
                                    KALLU SHAPPU MODE
                                  </span>
                                  <span style={{
                                    backgroundColor: '#5865F2',
                                    color: '#ffffff',
                                    fontSize: '0.625rem',
                                    fontWeight: '700',
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                    lineHeight: '0.8rem',
                                    height: '14px',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}>
                                    BOT
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: '#949ba4' }}>
                                    Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {/* Ping preview */}
                                  {settings.youtube?.pingRoleId && settings.youtube?.pingRoleId !== 'none' && (
                                    <span style={{
                                      backgroundColor: 'rgba(88, 101, 242, 0.3)',
                                      color: '#c9cdfb',
                                      padding: '0 4px',
                                      borderRadius: '3px',
                                      fontWeight: '500',
                                      marginRight: '6px',
                                      userSelect: 'none'
                                    }}>
                                      {settings.youtube?.pingRoleId === 'everyone' ? '@everyone' :
                                        settings.youtube?.pingRoleId === 'here' ? '@here' :
                                          `@${roles.find(r => r.id === settings.youtube?.pingRoleId)?.name || 'Role'}`}
                                    </span>
                                  )}

                                  {/* Message template preview resolved */}
                                  {(() => {
                                    let resolved = settings.youtube?.messageTemplate || '{url}';
                                    if (!/{url}/i.test(resolved)) {
                                      resolved = resolved.trim() ? `${resolved.trim()}\n{url}` : '{url}';
                                    }
                                    resolved = resolved
                                      .replace(/{channel}/gi, settings.youtube?.channelName || 'Kallu Shappu')
                                      .replace(/{title}/gi, 'My Awesome New Video!')
                                      .replace(/{url}/gi, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

                                    // Parse bold markdown tags **text** into HTML preview
                                    const parts = resolved.split(/(\*\*.*?\*\*)/g);
                                    return parts.map((part, index) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={index} style={{ color: '#ffffff' }}>{part.slice(2, -2)}</strong>;
                                      }
                                      return part;
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 9: TEMPORARY VOICE CHANNELS */}
              {activeTab === 'tempvoice' && settings && (() => {
                const currentChannels = (Array.isArray(settings.tempVoice?.channels) && settings.tempVoice.channels.length > 0)
                  ? settings.tempVoice.channels
                  : [{
                    channelId: settings.tempVoice?.channelId || '',
                    categoryId: settings.tempVoice?.categoryId || '',
                    nameTemplate: settings.tempVoice?.nameTemplate || "🔊 {username}'s Room",
                    userLimit: settings.tempVoice?.userLimit !== undefined ? settings.tempVoice.userLimit : 'auto'
                  }];

                const updateTempVoiceChannels = (newChannels) => {
                  const updatedTempVoice = {
                    ...(settings.tempVoice || {}),
                    channels: newChannels,
                    channelId: newChannels[0]?.channelId || '',
                    categoryId: newChannels[0]?.categoryId || '',
                    nameTemplate: newChannels[0]?.nameTemplate || "🔊 {username}'s Room",
                    userLimit: newChannels[0]?.userLimit !== undefined ? newChannels[0].userLimit : 'auto'
                  };
                  handleInputChange('tempVoice', updatedTempVoice);
                };

                const handleChannelChange = (index, field, value) => {
                  const next = currentChannels.map((item, idx) => {
                    if (idx === index) {
                      return { ...item, [field]: value };
                    }
                    return item;
                  });
                  updateTempVoiceChannels(next);
                };

                const handleAddChannel = () => {
                  if (currentChannels.length >= 10) return;
                  const next = [
                    ...currentChannels,
                    { channelId: '', categoryId: '', nameTemplate: "🔊 {username}'s Room", userLimit: 'auto' }
                  ];
                  updateTempVoiceChannels(next);
                };

                const handleRemoveChannel = (index) => {
                  if (currentChannels.length <= 1) {
                    const next = [{ channelId: '', categoryId: '', nameTemplate: "🔊 {username}'s Room", userLimit: 'auto' }];
                    updateTempVoiceChannels(next);
                  } else {
                    const next = currentChannels.filter((_, idx) => idx !== index);
                    updateTempVoiceChannels(next);
                  }
                };

                return (
                  <div>
                    <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Join-to-Create Voice Channels</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Configure up to 10 automated temporary voice channel triggers with customized member limits (e.g. 2-person Duo channels, 3-person Trios, Squads).
                          </p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={settings.tempVoice?.enabled || false}
                            onChange={() => handleToggle('tempVoice.enabled')}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      {settings.tempVoice?.enabled && (
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              Trigger Channels ({currentChannels.length} / 10)
                            </span>
                            <button
                              type="button"
                              onClick={handleAddChannel}
                              disabled={currentChannels.length >= 10}
                              className="btn-primary"
                              style={{
                                padding: '6px 14px',
                                fontSize: '0.825rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                opacity: currentChannels.length >= 10 ? 0.5 : 1,
                                cursor: currentChannels.length >= 10 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <span>+ Add Trigger Channel</span>
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {currentChannels.map((chConfig, index) => {
                              const rawLimit = chConfig.userLimit;
                              const isAuto = rawLimit === undefined || rawLimit === null || rawLimit === '' || rawLimit === 'auto';
                              const numLimit = isAuto ? null : Number(rawLimit);
                              const isCustom = !isAuto && ![0, 2, 3, 4, 5].includes(numLimit);

                              return (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '10px',
                                    padding: '18px',
                                    position: 'relative'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                        OPTION #{index + 1}
                                      </span>
                                      {numLimit === 2 && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          👥 2 Persons (Duo)
                                        </span>
                                      )}
                                      {numLimit === 3 && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          👥 3 Persons (Trio)
                                        </span>
                                      )}
                                      {numLimit === 4 && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          👥 4 Persons (Squad)
                                        </span>
                                      )}
                                      {numLimit === 5 && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          👥 5 Persons (5-Stack)
                                        </span>
                                      )}
                                      {numLimit === 0 && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          🌐 Unlimited
                                        </span>
                                      )}
                                      {isAuto && (
                                        <span style={{ fontSize: '0.725rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                          ⚡ Auto Discord Limit
                                        </span>
                                      )}
                                    </div>

                                    {currentChannels.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveChannel(index)}
                                        style={{
                                          background: 'rgba(239, 68, 68, 0.15)',
                                          color: '#ef4444',
                                          border: '1px solid rgba(239, 68, 68, 0.3)',
                                          borderRadius: '6px',
                                          padding: '4px 10px',
                                          fontSize: '0.75rem',
                                          fontWeight: '600',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s'
                                        }}
                                      >
                                        Remove Option
                                      </button>
                                    )}
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                                    {/* Trigger Voice Channel */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        Trigger Channel (Join to Create) <span style={{ color: 'var(--danger)' }}>*</span>
                                      </label>
                                      <select
                                        value={chConfig.channelId || ''}
                                        onChange={(e) => handleChannelChange(index, 'channelId', e.target.value)}
                                        className="glass-input"
                                      >
                                        <option value="">-- Select voice channel --</option>
                                        {voiceChannels.map(vc => (
                                          <option key={vc.id} value={vc.id}>
                                            🔊 {vc.name}{vc.userLimit > 0 ? ` (${vc.userLimit} Persons Limit)` : ''}
                                          </option>
                                        ))}
                                      </select>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                        Members joining this channel will have a temporary room created for them.
                                      </span>
                                    </div>

                                    {/* Target Category */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        Target Category (Optional)
                                      </label>
                                      <select
                                        value={chConfig.categoryId || ''}
                                        onChange={(e) => handleChannelChange(index, 'categoryId', e.target.value)}
                                        className="glass-input"
                                      >
                                        <option value="">-- Use same category as trigger channel --</option>
                                        {categories.map(cat => (
                                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                      </select>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                        Category where newly created voice channels will be placed.
                                      </span>
                                    </div>

                                    {/* Channel Member Limit (Access Capacity) */}
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        Member Access Limit (Capacity)
                                      </label>
                                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                          value={isAuto ? 'auto' : (isCustom ? 'custom' : String(numLimit))}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'auto') {
                                              handleChannelChange(index, 'userLimit', 'auto');
                                            } else if (val === 'custom') {
                                              handleChannelChange(index, 'userLimit', 6);
                                            } else {
                                              handleChannelChange(index, 'userLimit', parseInt(val, 10));
                                            }
                                          }}
                                          className="glass-input"
                                          style={{ flex: 1 }}
                                        >
                                          <option value="auto">⚡ Auto (Match Trigger Channel Limit)</option>
                                          <option value="2">👥 2 Persons (Duo Channel)</option>
                                          <option value="3">👥 3 Persons (Trio Channel)</option>
                                          <option value="4">👥 4 Persons (Squad Channel)</option>
                                          <option value="5">👥 5 Persons (5-Stack)</option>
                                          <option value="0">🌐 Unlimited (No Limit)</option>
                                          <option value="custom">⚙️ Custom Limit (1-99)...</option>
                                        </select>

                                        {isCustom && (
                                          <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={numLimit || 6}
                                            onChange={(e) => {
                                              const n = parseInt(e.target.value, 10);
                                              handleChannelChange(index, 'userLimit', isNaN(n) ? 2 : Math.max(1, Math.min(99, n)));
                                            }}
                                            className="glass-input"
                                            style={{ width: '80px', textAlign: 'center' }}
                                            placeholder="Limit"
                                          />
                                        )}
                                      </div>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                        {numLimit === 2
                                          ? '🔒 Voice channel will be created with exactly 2 member access.'
                                          : numLimit > 0
                                            ? `🔒 Voice channel will be created with ${numLimit} member access.`
                                            : numLimit === 0
                                              ? '🌐 Voice channel will have unlimited access.'
                                              : '⚡ Automatically inherits the user limit of the trigger channel from Discord.'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Channel Name Template */}
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                      Channel Name Template
                                    </label>
                                    <input
                                      type="text"
                                      value={chConfig.nameTemplate || ''}
                                      onChange={(e) => handleChannelChange(index, 'nameTemplate', e.target.value)}
                                      className="glass-input"
                                      style={{ maxWidth: '450px' }}
                                      placeholder="🔊 {username}'s Room"
                                    />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                      Supports placeholders: <code>{`{username}`}</code> (creator name), <code>{`{limit}`}</code> (member limit)
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Fast Over-Limit Disconnect Enforcement Card */}
                          <div style={{
                            marginTop: '12px',
                            padding: '20px',
                            backgroundColor: 'rgba(239, 68, 68, 0.04)',
                            border: '1px solid rgba(239, 68, 68, 0.18)',
                            borderRadius: '12px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#f87171' }}>
                                    ⚡ Fast Over-Limit Disconnect
                                  </span>
                                  <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                    HIGH SPEED ENFORCEMENT
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '850px' }}>
                                  Instantly disconnect anyone (including Discord Administrators or members bypassing limits) who connects to a temporary voice channel after its maximum member limit is reached, unless they are whitelisted below.
                                </p>
                              </div>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={settings.tempVoice?.autoDisconnectOverLimit ?? true}
                                  onChange={() => handleToggle('tempVoice.autoDisconnectOverLimit')}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                          </div>

                          {/* Limit Bypass Whitelist Section */}
                          <div style={{
                            marginTop: '8px',
                            padding: '24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                          }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                  🛡️ Temp Voice Limit Bypass Whitelist
                                </span>
                                <span style={{ fontSize: '0.725rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                  ACCESS EXEMPTIONS
                                </span>
                              </div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Whitelisted roles and members are permitted to join temporary voice channels even after the member limit is full without being disconnected.
                              </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                              {/* Whitelisted Roles Column */}
                              <div style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '10px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    Whitelisted Roles
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {(settings.tempVoice?.whitelistedRoles || []).length} active
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                  Members with any of these roles can bypass temp VC capacity limits without getting kicked.
                                </p>

                                {/* Roles Checkbox List */}
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                  {roles.filter(r => r.name !== '@everyone').length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '12px' }}>
                                      No roles available.
                                    </div>
                                  ) : (
                                    roles.filter(r => r.name !== '@everyone').map(role => {
                                      const isChecked = (settings.tempVoice?.whitelistedRoles || []).some(r => (typeof r === 'string' ? r === role.id : (r.roleId === role.id || r.id === role.id)));
                                      return (
                                        <label
                                          key={role.id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                            transition: 'background 0.15s'
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleTempVoiceRoleWhitelist(role.id)}
                                          />
                                          <span style={{
                                            color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#ffffff',
                                            fontWeight: isChecked ? '600' : '400',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            @{role.name}
                                          </span>
                                        </label>
                                      );
                                    })
                                  )}
                                </div>
                              </div>

                              {/* Whitelisted Members Column */}
                              <div style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '10px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    Whitelisted Members
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {(settings.tempVoice?.whitelistedUsers || []).length} active
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                  Specific users exempt from temp VC capacity kicks. Search by username or paste Discord ID.
                                </p>

                                {/* Member Search Input & Add */}
                                <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                  <input
                                    type="text"
                                    value={tempVoiceSearchQuery}
                                    onChange={(e) => setTempVoiceSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleManualAddTempVoiceUserWhitelist();
                                      }
                                    }}
                                    placeholder="Search username or paste 18-digit ID..."
                                    className="glass-input"
                                    style={{ flex: 1, fontSize: '0.85rem' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleManualAddTempVoiceUserWhitelist}
                                    className="btn-primary"
                                    style={{ padding: '6px 14px', fontSize: '0.825rem', whiteSpace: 'nowrap' }}
                                  >
                                    Add
                                  </button>

                                  {/* Autocomplete Dropdown */}
                                  {tempVoiceSearchQuery.trim() && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '100%',
                                      left: 0,
                                      right: 0,
                                      marginTop: '4px',
                                      background: '#1e1f29',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: '8px',
                                      maxHeight: '180px',
                                      overflowY: 'auto',
                                      zIndex: 100,
                                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                                    }}>
                                      {tempVoiceSearchLoading ? (
                                        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                          Searching members...
                                        </div>
                                      ) : tempVoiceSearchedMembers.length === 0 ? (
                                        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                          No members found. Press Add to whitelist by ID.
                                        </div>
                                      ) : (
                                        tempVoiceSearchedMembers
                                          .filter(m => !(settings.tempVoice?.whitelistedUsers || []).some(u => (typeof u === 'string' ? u === m.id : u.userId === m.id)))
                                          .map(m => (
                                            <div
                                              key={m.id}
                                              onClick={() => {
                                                handleAddTempVoiceUserWhitelist(m.id, m);
                                                setTempVoiceSearchQuery('');
                                                setTempVoiceSearchedMembers([]);
                                              }}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                transition: 'background 0.15s'
                                              }}
                                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                              <img
                                                src={m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                                                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                                alt="avatar"
                                              />
                                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '500' }}>
                                                  {m.displayName || m.username}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                  @{m.username} ({m.id})
                                                </span>
                                              </div>
                                            </div>
                                          ))
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Currently Whitelisted Users Badges */}
                                <div style={{
                                  minHeight: '80px',
                                  maxHeight: '160px',
                                  overflowY: 'auto',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  borderRadius: '8px',
                                  padding: '8px',
                                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                                }}>
                                  {(!settings.tempVoice?.whitelistedUsers || settings.tempVoice.whitelistedUsers.length === 0) ? (
                                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                      No members specifically whitelisted yet.
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {settings.tempVoice.whitelistedUsers.map(u => {
                                        const uId = typeof u === 'string' ? u : u.userId;
                                        const uName = typeof u === 'string' ? u : (u.displayName || u.username || u.userId);
                                        const uAvatar = typeof u === 'object' && u.avatar ? u.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png';

                                        return (
                                          <div
                                            key={uId}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              padding: '6px 10px',
                                              background: 'rgba(0,0,0,0.3)',
                                              border: '1px solid rgba(255,255,255,0.06)',
                                              borderRadius: '6px'
                                            }}
                                          >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                              <img src={uAvatar} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
                                              <span style={{ fontSize: '0.8rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {uName}
                                              </span>
                                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                ({uId})
                                              </span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveTempVoiceUserWhitelist(uId)}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#f87171',
                                                cursor: 'pointer',
                                                padding: '2px 6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                              }}
                                              title="Remove from whitelist"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 8.8: PREMIUM POLLS */}
              {activeTab === 'polls' && (
                <div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start', marginBottom: '40px' }}>
                    {/* Left Column: Creator Form */}
                    <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

                      {/* Target Channel */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Discord Channel <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <select
                          value={pollChannelId}
                          onChange={(e) => setPollChannelId(e.target.value)}
                          className="glass-input"
                        >
                          <option value="">-- Select Discord Channel --</option>
                          {channels.map(ch => (
                            <option key={ch.id} value={ch.id}># {ch.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Question */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Poll Question <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input
                          type="text"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          maxLength={256}
                          className="glass-input"
                          placeholder="e.g., What feature should we build next?"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description / Details (Optional)</label>
                        <textarea
                          rows="3"
                          value={pollDescription}
                          onChange={(e) => setPollDescription(e.target.value)}
                          maxLength={1024}
                          className="glass-input"
                          placeholder="Provide context or explanation for the poll..."
                        />
                      </div>

                      {/* Options Configuration */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Poll Options ({pollOptions.length}/10)</h4>
                          <button
                            type="button"
                            onClick={() => {
                              if (pollOptions.length < 10) setPollOptions([...pollOptions, '']);
                            }}
                            disabled={pollOptions.length >= 10}
                            className="btn-success"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          >
                            + Add Option
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {pollOptions.map((opt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '24px', fontWeight: '600' }}>#{idx + 1}</span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...pollOptions];
                                  updated[idx] = e.target.value;
                                  setPollOptions(updated);
                                }}
                                className="glass-input"
                                placeholder={`Option ${idx + 1}`}
                                maxLength={80}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (pollOptions.length > 2) {
                                    setPollOptions(pollOptions.filter((_, i) => i !== idx));
                                  } else {
                                    alert('A poll must have at least 2 options.');
                                  }
                                }}
                                className="btn-danger"
                                style={{ padding: '8px 12px', height: '38px', display: 'flex', alignItems: 'center' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advanced Settings Row */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px' }}>Poll Settings</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Allow Multiple Choices</span>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Voters can select more than one option.</p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={pollMultipleChoice}
                                onChange={(e) => setPollMultipleChoice(e.target.checked)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <div>
                              <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Anonymous Voting</span>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Hide the identity of voters (votes count will still update).</p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={pollAnonymous}
                                onChange={(e) => setPollAnonymous(e.target.checked)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <div>
                              <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Show Live Results</span>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Allow users to see current vote counts in Discord before ending.</p>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={pollShowResultsBeforeEnding}
                                onChange={(e) => setPollShowResultsBeforeEnding(e.target.checked)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Auto-Expiration Date & Time (Optional)</label>
                            <input
                              type="datetime-local"
                              value={pollExpiresAt}
                              onChange={(e) => setPollExpiresAt(e.target.value)}
                              className="glass-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Embed Customization */}
                      <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px' }}>Style Customization</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Embed Color</label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="color"
                                  value={pollColor}
                                  onChange={(e) => setPollColor(e.target.value)}
                                  style={{ width: '40px', height: '40px', padding: '0', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                />
                                <input
                                  type="text"
                                  value={pollColor}
                                  onChange={(e) => setPollColor(e.target.value)}
                                  className="glass-input"
                                  placeholder="#2563eb"
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thumbnail URL</label>
                              <input
                                type="text"
                                value={pollThumbnailUrl}
                                onChange={(e) => setPollThumbnailUrl(e.target.value)}
                                className="glass-input"
                                placeholder="https://example.com/thumbnail.png"
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Image URL</label>
                            <input
                              type="text"
                              value={pollImageUrl}
                              onChange={(e) => setPollImageUrl(e.target.value)}
                              className="glass-input"
                              placeholder="https://example.com/banner.png"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={handleCreatePoll}
                          disabled={creatingPoll}
                          className="btn-primary pulse-glow"
                          style={{ gap: '10px' }}
                        >
                          <Send size={18} />
                          {creatingPoll ? 'Publishing...' : 'Publish Poll'}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Live Discord Preview */}
                    <div style={{
                      flex: '1 0 350px',
                      maxWidth: '520px',
                      position: 'sticky',
                      top: '24px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <Eye size={14} />
                        Live Discord Preview
                      </span>
                      <DiscordMessagePreview
                        botUser={{ username: user?.username }}
                        guildName={guildName}
                        guildIcon={guildIcon}
                        message={pollDescription}
                        buttonEnabled={false}
                        buttonLabel=""
                        embedEnabled={true}
                        embedTitle={`Poll: ${pollQuestion || 'Enter Question'}`}
                        embedDesc={pollDescription}
                        embedColor={pollColor}
                        embedThumb={pollThumbnailUrl}
                        embedImage={pollImageUrl}
                        isDM={false}
                        buttons={pollOptions.filter(Boolean).map(opt => ({ label: opt }))}
                      />
                    </div>
                  </div>

                  {/* Polls History & Live Stats — Premium Glassmorphic Design */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '36px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Manage Server Polls</h3>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(148,163,184,0.7)', margin: '4px 0 0 0' }}>{polls.length} poll{polls.length !== 1 ? 's' : ''} found</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', fontSize: '0.78rem', color: '#60a5fa', fontWeight: '600' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                        Live Synced
                      </div>
                    </div>

                    {polls.length === 0 ? (
                      <div style={{
                        padding: '60px 40px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.9))',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(12px)'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📊</div>
                        <p style={{ color: 'rgba(148,163,184,0.8)', margin: 0, fontSize: '1rem' }}>No polls yet. Create your first poll above or use <code style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/poll</code> in Discord!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
                        {polls.map(poll => {
                          const allVoters = new Set();
                          let maxVotes = 0;
                          poll.options.forEach(opt => {
                            if (opt.votes) opt.votes.forEach(v => allVoters.add(v));
                            const cnt = opt.votes ? opt.votes.length : 0;
                            if (cnt > maxVotes) maxVotes = cnt;
                          });
                          const totalVotes = allVoters.size;
                          const isPollActive = poll.status === 'active';
                          const themeColor = poll.settings?.color || '#2563eb';

                          return (
                            <div
                              key={poll._id}
                              style={{
                                position: 'relative',
                                background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: isPollActive
                                  ? `1px solid ${themeColor}55`
                                  : '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '20px',
                                padding: '22px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                boxShadow: isPollActive
                                  ? `0 0 30px ${themeColor}22, 0 8px 32px rgba(0,0,0,0.5)`
                                  : '0 8px 32px rgba(0,0,0,0.4)',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                cursor: 'default',
                                overflow: 'hidden'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = isPollActive
                                  ? `0 0 40px ${themeColor}33, 0 16px 48px rgba(0,0,0,0.6)`
                                  : '0 16px 48px rgba(0,0,0,0.6)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isPollActive
                                  ? `0 0 30px ${themeColor}22, 0 8px 32px rgba(0,0,0,0.5)`
                                  : '0 8px 32px rgba(0,0,0,0.4)';
                              }}
                            >
                              {/* Subtle top accent line */}
                              <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0,
                                height: '2px',
                                background: isPollActive
                                  ? `linear-gradient(90deg, transparent, ${themeColor}, transparent)`
                                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                borderRadius: '20px 20px 0 0'
                              }} />

                              {/* Header Row */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {/* Status Badge */}
                                  {isPollActive ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite', boxShadow: '0 0 6px #22c55e' }} />
                                      Active
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.25)', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      Ended
                                    </div>
                                  )}
                                  {/* Color dot */}
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: themeColor, boxShadow: `0 0 6px ${themeColor}` }} />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontWeight: '500' }}>
                                  {new Date(poll.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>

                              {/* Question */}
                              <div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f1f5f9', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                                  {poll.question}
                                </h4>
                                {poll.description && (
                                  <p style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.7)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                                    {poll.description}
                                  </p>
                                )}
                              </div>

                              {/* Premium Progress Bars */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {poll.options.map((opt, idx) => {
                                  const optVotes = opt.votes ? opt.votes.length : 0;
                                  const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                                  const isWinner = !isPollActive && optVotes > 0 && optVotes === maxVotes;
                                  const barColor = isWinner ? '#eab308' : themeColor;

                                  return (
                                    <div key={opt.id || idx} style={{ position: 'relative' }}>
                                      {/* Label Row */}
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{
                                          fontSize: '0.8rem',
                                          fontWeight: isWinner ? '700' : '500',
                                          color: isWinner ? '#fde047' : 'rgba(226,232,240,0.85)',
                                          display: 'flex', alignItems: 'center', gap: '5px',
                                          maxWidth: '72%',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {isWinner && <span style={{ fontSize: '0.9rem' }}>👑</span>}
                                          {opt.text}
                                        </span>
                                        <span style={{
                                          fontSize: '0.78rem',
                                          fontWeight: '700',
                                          color: isWinner ? '#fde047' : 'rgba(226,232,240,0.9)',
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {pct}% <span style={{ opacity: 0.5, fontWeight: '400' }}>({optVotes})</span>
                                        </span>
                                      </div>

                                      {/* Bar Track */}
                                      <div style={{
                                        width: '100%',
                                        height: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '999px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                      }}>
                                        {/* Filled portion */}
                                        <div style={{
                                          width: `${pct}%`,
                                          height: '100%',
                                          background: isWinner
                                            ? 'linear-gradient(90deg, #ca8a04, #fde047)'
                                            : `linear-gradient(90deg, ${themeColor}, ${themeColor}cc)`,
                                          borderRadius: '999px',
                                          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                                          position: 'relative',
                                          boxShadow: pct > 0 ? `0 0 10px ${barColor}88` : 'none'
                                        }}>
                                          {/* Sheen overlay */}
                                          {pct > 10 && (
                                            <div style={{
                                              position: 'absolute',
                                              inset: 0,
                                              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                                              borderRadius: '999px'
                                            }} />
                                          )}
                                        </div>
                                      </div>

                                      {/* Winner gold border accent */}
                                      {isWinner && (
                                        <div style={{
                                          position: 'absolute',
                                          inset: -1,
                                          borderRadius: '6px',
                                          border: '1px solid rgba(234,179,8,0.25)',
                                          pointerEvents: 'none'
                                        }} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Footer */}
                              <div style={{
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                paddingTop: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.7)' }}>
                                    🗳️ <strong style={{ color: '#e2e8f0' }}>{totalVotes}</strong> voter{totalVotes !== 1 ? 's' : ''}
                                  </span>
                                  {poll.settings?.multipleChoice && (
                                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)', fontWeight: '600' }}>
                                      Multi-Choice
                                    </span>
                                  )}
                                  {poll.settings?.anonymous && (
                                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)', fontWeight: '600' }}>
                                      Anon
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {isPollActive && (
                                    <button
                                      type="button"
                                      onClick={() => handleEndPoll(poll._id)}
                                      style={{
                                        padding: '6px 14px',
                                        fontSize: '0.72rem',
                                        fontWeight: '700',
                                        border: '1px solid rgba(251,191,36,0.35)',
                                        background: 'rgba(251,191,36,0.1)',
                                        color: '#fbbf24',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        letterSpacing: '0.03em'
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.2)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(251,191,36,0.25)'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                      End Poll
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePoll(poll._id)}
                                    style={{
                                      padding: '6px 14px',
                                      fontSize: '0.72rem',
                                      fontWeight: '700',
                                      border: '1px solid rgba(239,68,68,0.3)',
                                      background: 'rgba(239,68,68,0.08)',
                                      color: '#f87171',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      letterSpacing: '0.03em'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Server Giveaways Tab */}
              {activeTab === 'giveaways' && (
                <div>
                  {/* Top Stats Banner */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                  }}>
                    <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                        <Gift size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#f8fafc', lineHeight: 1 }}>{giveaways.length}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginTop: '4px' }}>Total Giveaways</div>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(34, 197, 94, 0.3)', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                        <Clock size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#4ade80', lineHeight: 1 }}>
                          {giveaways.filter(g => g.status === 'active').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginTop: '4px' }}>Active Giveaways</div>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(234, 179, 8, 0.3)', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                        <Trophy size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#fde047', lineHeight: 1 }}>
                          {giveaways.reduce((acc, g) => acc + (g.entries ? g.entries.length : 0), 0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginTop: '4px' }}>Total Participants</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start', marginBottom: '40px' }}>
                    {/* Left Column: Giveaway Form */}
                    <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

                      {/* Target Channel */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Discord Channel <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <select
                          value={giveawayChannelId}
                          onChange={(e) => setGiveawayChannelId(e.target.value)}
                          className="glass-input"
                        >
                          <option value="">-- Select Discord Channel --</option>
                          {channels.map(ch => (
                            <option key={ch.id} value={ch.id}># {ch.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Prize Title */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Giveaway Prize <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input
                          type="text"
                          value={giveawayPrize}
                          onChange={(e) => setGiveawayPrize(e.target.value)}
                          maxLength={256}
                          className="glass-input"
                          placeholder="e.g. Discord Nitro (1 Month), $25 Steam Gift Card, VIP Server Role"
                        />
                      </div>

                      {/* Description / Extra Rules */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description / Rules (Optional)</label>
                        <textarea
                          rows="3"
                          value={giveawayDescription}
                          onChange={(e) => setGiveawayDescription(e.target.value)}
                          maxLength={1024}
                          className="glass-input"
                          placeholder="Provide details, sponsor info, or terms for this giveaway..."
                        />
                      </div>

                      {/* Winners Count & Duration Row */}
                      <div className="glass-panel" style={{ padding: '18px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Number of Winners</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={giveawayWinnerCount}
                              onChange={(e) => setGiveawayWinnerCount(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                              className="glass-input"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', marginTop: '4px', display: 'block' }}>Between 1 and 20 winners</span>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Giveaway Duration</label>
                            {/* Preset Buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                              {['10m', '30m', '1h', '6h', '12h', '24h', '3d', '7d'].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => {
                                    setGiveawayDuration(preset);
                                    setGiveawayCustomEndsAt('');
                                  }}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: (!giveawayCustomEndsAt && giveawayDuration === preset) ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                                    background: (!giveawayCustomEndsAt && giveawayDuration === preset) ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.04)',
                                    color: (!giveawayCustomEndsAt && giveawayDuration === preset) ? '#c4b5fd' : '#cbd5e1',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                            <input
                              type="datetime-local"
                              value={giveawayCustomEndsAt}
                              onChange={(e) => setGiveawayCustomEndsAt(e.target.value)}
                              className="glass-input"
                              placeholder="Or pick specific end date/time"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Requirements & Ping Settings */}
                      <div className="glass-panel" style={{ padding: '18px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px' }}>Eligibility & Mentions</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role Requirement (Optional)</label>
                            <select
                              value={giveawayRequireRole}
                              onChange={(e) => setGiveawayRequireRole(e.target.value)}
                              className="glass-input"
                            >
                              <option value="">No Role Required (Open to all members)</option>
                              {roles.map(r => (
                                <option key={r.id} value={r.id}>@ {r.name}</option>
                              ))}
                            </select>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', marginTop: '4px', display: 'block' }}>Only members with this role can click to enter</span>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Launch Ping</label>
                            <select
                              value={giveawayPingType}
                              onChange={(e) => setGiveawayPingType(e.target.value)}
                              className="glass-input"
                            >
                              <option value="none">No Ping</option>
                              <option value="everyone">@everyone</option>
                              <option value="here">@here</option>
                              <option value="role">Specific Role</option>
                            </select>
                            {giveawayPingType === 'role' && (
                              <select
                                value={giveawayPingRoleId}
                                onChange={(e) => setGiveawayPingRoleId(e.target.value)}
                                className="glass-input"
                                style={{ marginTop: '8px' }}
                              >
                                <option value="">-- Select Role to Mention --</option>
                                {roles.map(r => (
                                  <option key={r.id} value={r.id}>@ {r.name}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Style Customization */}
                      <div className="glass-panel" style={{ padding: '18px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px' }}>Embed Appearance</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Accent Color</label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="color"
                                  value={giveawayColor}
                                  onChange={(e) => setGiveawayColor(e.target.value)}
                                  style={{ width: '40px', height: '40px', padding: '0', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                />
                                <input
                                  type="text"
                                  value={giveawayColor}
                                  onChange={(e) => setGiveawayColor(e.target.value)}
                                  className="glass-input"
                                  placeholder="#8b5cf6"
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thumbnail URL (Optional)</label>
                              <input
                                type="text"
                                value={giveawayThumbnailUrl}
                                onChange={(e) => setGiveawayThumbnailUrl(e.target.value)}
                                className="glass-input"
                                placeholder="https://example.com/gift-icon.png"
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Banner Image URL (Optional)</label>
                            <input
                              type="text"
                              value={giveawayImageUrl}
                              onChange={(e) => setGiveawayImageUrl(e.target.value)}
                              className="glass-input"
                              placeholder="https://example.com/giveaway-banner.png"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={handleCreateGiveaway}
                          disabled={creatingGiveaway}
                          className="btn-primary pulse-glow"
                          style={{ gap: '10px', padding: '12px 28px', fontSize: '1rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', borderColor: '#a78bfa' }}
                        >
                          <Gift size={18} />
                          {creatingGiveaway ? 'Broadcasting...' : 'Launch Giveaway 🚀'}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Live Discord Preview */}
                    <div style={{
                      flex: '1 0 350px',
                      maxWidth: '520px',
                      position: 'sticky',
                      top: '24px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <Eye size={14} />
                        Live Discord Preview
                      </span>

                      {/* Mock Discord Message Container */}
                      <div style={{
                        backgroundColor: '#313338',
                        borderRadius: '8px',
                        padding: '16px',
                        color: '#dbdee1',
                        fontFamily: "'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: '0.9375rem',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        {/* Ping announcement prefix */}
                        {giveawayPingType !== 'none' && (
                          <div style={{ color: '#c9cdfb', marginBottom: '8px', fontSize: '0.85rem' }}>
                            {giveawayPingType === 'everyone' && '@everyone 🎉 A new giveaway has started!'}
                            {giveawayPingType === 'here' && '@here 🎉 A new giveaway has started!'}
                            {giveawayPingType === 'role' && (roles.find(r => r.id === giveawayPingRoleId)?.name ? `@${roles.find(r => r.id === giveawayPingRoleId)?.name} 🎉 A new giveaway has started!` : '@role 🎉 A new giveaway has started!')}
                          </div>
                        )}

                        {/* Bot Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            flexShrink: 0
                          }}>
                            {guildIcon ? <img src={guildIcon} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : 'K'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '600', color: '#f2f3f5' }}>KALLU SHAPPU BOT</span>
                              <span style={{ backgroundColor: '#5865F2', color: '#ffffff', fontSize: '0.625rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>BOT</span>
                              <span style={{ fontSize: '0.75rem', color: '#949ba4' }}>Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Embed Box */}
                        <div style={{
                          borderLeft: `4px solid ${giveawayColor || '#8b5cf6'}`,
                          backgroundColor: '#2b2d31',
                          borderRadius: '4px',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '1.05rem', marginBottom: '8px' }}>
                                🎉 GIVEAWAY: {giveawayPrize || 'Enter Prize Name'}
                              </div>

                              {giveawayDescription && (
                                <div style={{ color: '#dbdee1', fontSize: '0.85rem', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                                  {giveawayDescription}
                                </div>
                              )}

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                                <div>🎁 <strong>Prize:</strong> <span style={{ color: '#f8fafc' }}>{giveawayPrize || 'Example Prize'}</span></div>
                                <div>👑 <strong>Winners:</strong> <span style={{ color: '#f8fafc' }}>{giveawayWinnerCount}</span></div>
                                <div>👤 <strong>Hosted by:</strong> <span style={{ color: '#60a5fa' }}>@{user?.username || 'Admin'}</span></div>
                                <div>🎟️ <strong>Entries:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>0</span></div>
                                {giveawayRequireRole && (
                                  <div>🔒 <strong>Required Role:</strong> <span style={{ color: '#c084fc' }}>@{roles.find(r => r.id === giveawayRequireRole)?.name || 'Role'}</span></div>
                                )}
                                <div style={{ marginTop: '6px', color: '#e2e8f0' }}>
                                  ⏳ <strong>Ends:</strong> <span style={{ color: '#38bdf8' }}>{giveawayCustomEndsAt ? new Date(giveawayCustomEndsAt).toLocaleString() : `in ${giveawayDuration}`}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>Click the button below to enter!</div>
                              </div>
                            </div>

                            {giveawayThumbnailUrl && (
                              <img
                                src={giveawayThumbnailUrl}
                                alt="Thumbnail"
                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>

                          {giveawayImageUrl && (
                            <img
                              src={giveawayImageUrl}
                              alt="Banner"
                              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', marginTop: '4px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}

                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
                            KALLU SHAPPU Giveaways • Ends at {giveawayCustomEndsAt ? new Date(giveawayCustomEndsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(Date.now() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Interactive Buttons Preview */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button
                            type="button"
                            style={{
                              backgroundColor: '#248046',
                              color: '#ffffff',
                              padding: '8px 16px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            🎉 Enter (0)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Giveaways Management Section */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '36px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Server Giveaways List
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(148,163,184,0.7)', margin: '4px 0 0 0' }}>
                          {giveaways.length} giveaway{giveaways.length !== 1 ? 's' : ''} on record
                        </p>
                      </div>

                      {/* Filter tabs */}
                      <div style={{ display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                          type="button"
                          onClick={() => setGiveawayFilter('all')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            background: giveawayFilter === 'all' ? '#8b5cf6' : 'transparent',
                            color: giveawayFilter === 'all' ? '#ffffff' : '#94a3b8'
                          }}
                        >
                          All ({giveaways.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setGiveawayFilter('active')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            background: giveawayFilter === 'active' ? '#22c55e' : 'transparent',
                            color: giveawayFilter === 'active' ? '#ffffff' : '#94a3b8'
                          }}
                        >
                          Active ({giveaways.filter(g => g.status === 'active').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setGiveawayFilter('ended')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            background: giveawayFilter === 'ended' ? '#64748b' : 'transparent',
                            color: giveawayFilter === 'ended' ? '#ffffff' : '#94a3b8'
                          }}
                        >
                          Ended ({giveaways.filter(g => g.status === 'ended').length})
                        </button>
                      </div>
                    </div>

                    {/* Giveaways List / Grid */}
                    {giveaways.filter(g => giveawayFilter === 'all' || g.status === giveawayFilter).length === 0 ? (
                      <div style={{
                        padding: '60px 40px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.9))',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(12px)'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
                        <p style={{ color: 'rgba(148,163,184,0.8)', margin: 0, fontSize: '1rem' }}>
                          No {giveawayFilter !== 'all' ? giveawayFilter : ''} giveaways found. Launch a new giveaway above or type <code style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/giveaway start</code> in Discord!
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '22px' }}>
                        {giveaways
                          .filter(g => giveawayFilter === 'all' || g.status === giveawayFilter)
                          .map(ga => {
                            const isGAActive = ga.status === 'active';
                            const targetChannelObj = channels.find(c => c.id === ga.channelId);
                            const endsDate = new Date(ga.endsAt);
                            const isPastEnds = endsDate <= new Date();
                            const themeColor = ga.settings?.color || '#8b5cf6';
                            const entriesCount = ga.entries ? ga.entries.length : 0;

                            return (
                              <div
                                key={ga._id}
                                style={{
                                  position: 'relative',
                                  background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
                                  backdropFilter: 'blur(20px)',
                                  WebkitBackdropFilter: 'blur(20px)',
                                  border: isGAActive
                                    ? `1px solid ${themeColor}66`
                                    : '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: '20px',
                                  padding: '22px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '16px',
                                  boxShadow: isGAActive
                                    ? `0 0 30px ${themeColor}22, 0 8px 32px rgba(0,0,0,0.5)`
                                    : '0 8px 32px rgba(0,0,0,0.4)',
                                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                  overflow: 'hidden'
                                }}
                              >
                                {/* Top colored accent line */}
                                <div style={{
                                  position: 'absolute',
                                  top: 0, left: 0, right: 0,
                                  height: '3px',
                                  background: isGAActive
                                    ? `linear-gradient(90deg, transparent, ${themeColor}, transparent)`
                                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                  borderRadius: '20px 20px 0 0'
                                }} />

                                {/* Header row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isGAActive ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                                        Active
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.25)', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                                        Concluded
                                      </div>
                                    )}

                                    <span style={{ fontSize: '0.75rem', color: '#60a5fa', background: 'rgba(37,99,235,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                                      # {targetChannelObj?.name || ga.channelId}
                                    </span>
                                  </div>

                                  <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)' }}>
                                    {new Date(ga.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Prize Title & Details */}
                                <div>
                                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f1f5f9', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                                    🎁 {ga.prize}
                                  </h4>
                                  {ga.description && (
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.7)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {ga.description}
                                    </p>
                                  )}
                                </div>

                                {/* Metrics info box */}
                                <div style={{
                                  background: 'rgba(0,0,0,0.2)',
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  borderRadius: '12px',
                                  padding: '12px 14px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', fontWeight: '600' }}>Entries</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span>🎟️ {entriesCount}</span>
                                      {isGAActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />}
                                    </div>
                                  </div>

                                  <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', fontWeight: '600' }}>Winners</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fde047' }}>
                                      👑 {ga.winnerCount}
                                    </div>
                                  </div>

                                  <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', fontWeight: '600' }}>
                                      {isGAActive ? 'Remaining' : 'Ended'}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: isGAActive ? '#38bdf8' : '#94a3b8' }}>
                                      {isGAActive ? (
                                        isPastEnds ? 'Closing soon...' : `${Math.ceil((endsDate - new Date()) / (1000 * 60 * 60))}h remaining`
                                      ) : (
                                        endsDate.toLocaleDateString()
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* If ended: Winners Showcase */}
                                {!isGAActive && (
                                  <div style={{
                                    background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(15,23,42,0.4))',
                                    border: '1px solid rgba(234,179,8,0.25)',
                                    borderRadius: '10px',
                                    padding: '10px 12px'
                                  }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fde047', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Trophy size={14} />
                                      Selected Winner(s):
                                    </div>
                                    {ga.winners && ga.winners.length > 0 ? (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {ga.winners.map((w, idx) => (
                                          <span
                                            key={idx}
                                            style={{
                                              background: 'rgba(0,0,0,0.4)',
                                              border: '1px solid rgba(234,179,8,0.3)',
                                              padding: '2px 8px',
                                              borderRadius: '6px',
                                              fontSize: '0.78rem',
                                              color: '#fef08a',
                                              fontWeight: '600'
                                            }}
                                          >
                                            👑 {w.username ? `@${w.username}` : `<@${w.id}>`}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.7)', fontStyle: 'italic' }}>
                                        No participants entered.
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{
                                  borderTop: '1px solid rgba(255,255,255,0.06)',
                                  paddingTop: '14px',
                                  marginTop: 'auto',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.5)' }}>
                                    ID: <code style={{ color: '#94a3b8' }}>{ga.messageId?.slice(-6) || '...'}</code>
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenParticipantsModal(ga, 'view')}
                                      style={{
                                        padding: '6px 12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        border: '1px solid rgba(56,189,248,0.35)',
                                        background: 'rgba(56,189,248,0.1)',
                                        color: '#38bdf8',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                      title="View all entrants from dashboard"
                                    >
                                      <Users size={13} />
                                      Participants ({entriesCount})
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenParticipantsModal(ga, 'select')}
                                      style={{
                                        padding: '6px 12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        border: '1px solid rgba(168,85,247,0.4)',
                                        background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.1))',
                                        color: '#c084fc',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                      title="Manually select giveaway winners"
                                    >
                                      <Award size={13} />
                                      Select Winners
                                    </button>

                                    {isGAActive ? (
                                      <button
                                        type="button"
                                        onClick={() => handleEndGiveaway(ga._id)}
                                        style={{
                                          padding: '6px 12px',
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          border: '1px solid rgba(234,179,8,0.4)',
                                          background: 'rgba(234,179,8,0.12)',
                                          color: '#facc15',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}
                                        title="End giveaway now with random winner draw"
                                      >
                                        <Trophy size={13} />
                                        End Now
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRerollGiveaway(ga._id)}
                                        style={{
                                          padding: '6px 12px',
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          border: '1px solid rgba(139,92,246,0.4)',
                                          background: 'rgba(139,92,246,0.15)',
                                          color: '#c4b5fd',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}
                                        title="Randomly reroll winner(s)"
                                      >
                                        <RotateCw size={13} />
                                        Reroll
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteGiveaway(ga._id)}
                                      style={{
                                        padding: '6px 12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        background: 'rgba(239,68,68,0.08)',
                                        color: '#f87171',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                    >
                                      <Trash2 size={13} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Participants & Manual Winner Selection Modal */}
              {selectedGiveawayForParticipants && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.78)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                  }}
                  onClick={() => {
                    if (!savingManualWinners) setSelectedGiveawayForParticipants(null);
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#0f172a',
                      background: 'linear-gradient(145deg, #111827 0%, #030712 100%)',
                      border: '1px solid rgba(139,92,246,0.35)',
                      borderRadius: '20px',
                      width: '100%',
                      maxWidth: '740px',
                      maxHeight: '90vh',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(139,92,246,0.18)',
                      overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: 'rgba(139,92,246,0.18)',
                            border: '1px solid rgba(139,92,246,0.4)',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: '#c4b5fd',
                            textTransform: 'uppercase'
                          }}>
                            <Gift size={12} />
                            Giveaway Participants & Winners
                          </span>
                          {selectedGiveawayForParticipants.status === 'active' ? (
                            <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', fontWeight: '700', color: '#4ade80' }}>
                              Active
                            </span>
                          ) : (
                            <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(100,116,139,0.2)', border: '1px solid rgba(100,116,139,0.3)', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>
                              Concluded
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🎁 {selectedGiveawayForParticipants.prize}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'rgba(148,163,184,0.8)' }}>
                          Required Winners: <strong style={{ color: '#fde047' }}>{selectedGiveawayForParticipants.winnerCount}</strong> • Channel: <span style={{ color: '#60a5fa' }}>#{channels.find(c => c.id === selectedGiveawayForParticipants.channelId)?.name || selectedGiveawayForParticipants.channelId}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!savingManualWinners) setSelectedGiveawayForParticipants(null);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94a3b8',
                          borderRadius: '10px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Privacy Banner */}
                    <div style={{
                      margin: '14px 24px 0 24px',
                      padding: '10px 14px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.78rem',
                      color: '#bae6fd'
                    }}>
                      <Shield size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                      <span>
                        <strong>Dashboard-Only View:</strong> Entrant lists and identities are strictly private to this bot dashboard and are hidden from Discord channel messages.
                      </span>
                    </div>

                    {/* Controls Bar: Search & Quick Selection */}
                    <div style={{
                      padding: '14px 24px 10px 24px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ position: 'relative', flex: '1 1 240px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="text"
                          value={participantSearch}
                          onChange={(e) => setParticipantSearch(e.target.value)}
                          placeholder="Search participant by username or ID..."
                          className="glass-input"
                          style={{ width: '100%', paddingLeft: '34px', fontSize: '0.82rem', height: '36px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: selectedWinnerIds.length === selectedGiveawayForParticipants.winnerCount ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.15)',
                          border: selectedWinnerIds.length === selectedGiveawayForParticipants.winnerCount ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(139,92,246,0.3)',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          color: selectedWinnerIds.length === selectedGiveawayForParticipants.winnerCount ? '#4ade80' : '#c4b5fd'
                        }}>
                          Selected: {selectedWinnerIds.length} / {selectedGiveawayForParticipants.winnerCount} winner(s)
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickPickRandom(selectedGiveawayForParticipants.winnerCount)}
                          disabled={giveawayParticipants.length === 0}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#e2e8f0',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Pick random participants up to winner count"
                        >
                          <RotateCw size={12} />
                          Quick Pick ({selectedGiveawayForParticipants.winnerCount})
                        </button>

                        {selectedWinnerIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedWinnerIds([])}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#f87171',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Participants List */}
                    <div style={{
                      padding: '0 24px 16px 24px',
                      overflowY: 'auto',
                      maxHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {loadingParticipants ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                          <div style={{ width: '28px', height: '28px', border: '3px solid rgba(139,92,246,0.3)', borderTopColor: '#a78bfa', borderRadius: '50%', margin: '0 auto 12px auto', animation: 'spin 1s linear infinite' }} />
                          <p style={{ margin: 0, fontSize: '0.85rem' }}>Loading giveaway participants from server...</p>
                        </div>
                      ) : giveawayParticipants.length === 0 ? (
                        <div style={{
                          padding: '40px 20px',
                          textAlign: 'center',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px dashed rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          color: '#94a3b8'
                        }}>
                          <Users size={32} style={{ color: '#64748b', marginBottom: '8px' }} />
                          <div style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>No Participants Yet</div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                            Nobody has clicked Enter on the Discord giveaway message yet.
                          </p>
                        </div>
                      ) : (
                        giveawayParticipants
                          .filter(p => {
                            if (!participantSearch.trim()) return true;
                            const q = participantSearch.toLowerCase();
                            return (
                              (p.username && p.username.toLowerCase().includes(q)) ||
                              (p.displayName && p.displayName.toLowerCase().includes(q)) ||
                              (p.id && p.id.includes(q))
                            );
                          })
                          .map(p => {
                            const isSelected = selectedWinnerIds.includes(p.id);
                            const isExistingWinner = p.isWinner;

                            return (
                              <div
                                key={p.id}
                                onClick={() => handleToggleWinnerSelection(p.id)}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: '12px',
                                  background: isSelected
                                    ? 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.15) 100%)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                  border: isSelected
                                    ? '1px solid rgba(168,85,247,0.5)'
                                    : '1px solid rgba(255, 255, 255, 0.06)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                  {/* Checkbox */}
                                  <div style={{ color: isSelected ? '#a855f7' : '#64748b', display: 'flex', alignItems: 'center' }}>
                                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                  </div>

                                  {/* Avatar */}
                                  {p.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt=""
                                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '50%',
                                      background: 'linear-gradient(135deg, #475569, #334155)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                      color: '#fff'
                                    }}>
                                      {p.username ? p.username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  )}

                                  {/* User Details */}
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {p.displayName || p.username}
                                      </span>
                                      {p.username && p.displayName && p.displayName !== p.username && (
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                          @{p.username}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                      ID: <code style={{ color: '#94a3b8' }}>{p.id}</code>
                                    </div>
                                  </div>
                                </div>

                                {/* Badges / Selection status */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                  {isExistingWinner && (
                                    <span style={{
                                      padding: '3px 8px',
                                      borderRadius: '6px',
                                      background: 'rgba(234, 179, 8, 0.15)',
                                      border: '1px solid rgba(234, 179, 8, 0.3)',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      color: '#fde047',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      👑 Current Winner
                                    </span>
                                  )}

                                  {isSelected ? (
                                    <span style={{
                                      padding: '3px 10px',
                                      borderRadius: '6px',
                                      background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(139,92,246,0.3))',
                                      border: '1px solid #a855f7',
                                      fontSize: '0.72rem',
                                      fontWeight: '700',
                                      color: '#f3e8ff'
                                    }}>
                                      Selected Winner
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                      Click to pick
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                      padding: '16px 24px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {giveawayParticipants.length} total participant{giveawayParticipants.length !== 1 ? 's' : ''} on record
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!savingManualWinners) setSelectedGiveawayForParticipants(null);
                          }}
                          disabled={savingManualWinners}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveManualWinners}
                          disabled={savingManualWinners || selectedWinnerIds.length === 0}
                          className="btn-primary"
                          style={{
                            padding: '8px 20px',
                            fontSize: '0.85rem',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            borderColor: '#a855f7',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: selectedWinnerIds.length === 0 ? 0.5 : 1
                          }}
                        >
                          <Trophy size={14} />
                          {savingManualWinners
                            ? 'Announcing in Discord...'
                            : selectedGiveawayForParticipants.status === 'active'
                              ? `Conclude with ${selectedWinnerIds.length} Winner${selectedWinnerIds.length !== 1 ? 's' : ''} 🏆`
                              : `Update to ${selectedWinnerIds.length} Winner${selectedWinnerIds.length !== 1 ? 's' : ''} 🏆`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Settings Button footer */}
              {activeTab !== 'overview' && activeTab !== 'logs' && activeTab !== 'broadcast' && activeTab !== 'publish' && activeTab !== 'polls' && activeTab !== 'giveaways' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving || !hasUnsavedChanges()}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    Reset Changes
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary pulse-glow"
                    style={{ gap: '10px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              )}

            </form>
          )}
        </main>
      </div>

      {showCropModal && uploadFile && (
        <CropModal
          file={uploadFile}
          onClose={() => {
            setShowCropModal(false);
            setUploadFile(null);
          }}
          onCrop={async ({ file, cropX, cropY, cropWidth, cropHeight }) => {
            setShowCropModal(false);
            setUploadFile(null);
            setSaving(true);
            setErrorMsg(null);
            try {
              const res = await api.uploadBackground(guildId, file, { cropX, cropY, cropWidth, cropHeight });
              handleInputChange('welcome.background', res.url);
              showNotification('Background uploaded and cropped successfully!');
            } catch (err) {
              console.error(err);
              setErrorMsg(err.message || 'File upload failed.');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {/* Discord Components V2 JSON Modal */}
      {showV2JsonModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            borderRadius: '16px',
            background: '#0d0f1a',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Code size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    Discord Components V2 Payload JSON
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    flags: 32768 • ComponentType.TEXT_DISPLAY (10) & MEDIA_GALLERY (12)
                  </p>
                </div>
              </div>
              <X
                size={20}
                style={{ cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setShowV2JsonModal(false)}
              />
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#05070e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '16px',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '0.82rem',
              color: '#38bdf8',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              userSelect: 'text'
            }}>
              {JSON.stringify(getWelcomeV2JsonPayload(), null, 2)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Conforms strictly to Discord Message Components V2 API specifications
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const jsonStr = JSON.stringify(getWelcomeV2JsonPayload(), null, 2);
                    navigator.clipboard.writeText(jsonStr);
                    setCopiedV2Json(true);
                    setTimeout(() => setCopiedV2Json(false), 2500);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: copiedV2Json ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                    border: copiedV2Json ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(56, 189, 248, 0.35)',
                    color: copiedV2Json ? '#34d399' : '#38bdf8',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {copiedV2Json ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy JSON Payload</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowV2JsonModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWordBulkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '24px', borderRadius: '16px', background: '#181824', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={20} color="#3b82f6" /> Bulk Upload Filtered Words
              </h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowWordBulkModal(false)} />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Upload a <code>.txt</code> or <code>.csv</code> file, or paste line-by-line / comma-separated words below.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem' }}>
                <UploadCloud size={16} /> Choose File (.txt / .csv)
                <input
                  type="file"
                  accept=".txt,.csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        setWordBulkText(evt.target.result || '');
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>

            <textarea
              rows="8"
              placeholder="Paste words here (one per line or comma separated)...&#10;badword1&#10;badword2, badword3"
              value={wordBulkText}
              onChange={(e) => setWordBulkText(e.target.value)}
              className="glass-input"
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowWordBulkModal(false)}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (wordBulkText.trim()) {
                    const parsed = wordBulkText
                      .split(/[\n,]+/)
                      .map(w => w.trim().toLowerCase())
                      .filter(Boolean);

                    const current = settings?.moderation?.wordFilter?.words || [];
                    const combined = Array.from(new Set([...current, ...parsed]));
                    handleInputChange('moderation.wordFilter.words', combined);
                    showNotification(`Imported ${combined.length - current.length} new words into directory.`);
                  }
                  setWordBulkText('');
                  setShowWordBulkModal(false);
                }}
              >
                Import Words
              </button>
            </div>
          </div>
        </div>
      )}

      <EmojiPickerModal
        isOpen={emojiPickerOpen}
        onClose={() => setEmojiPickerOpen(false)}
        onSelectEmoji={(emoji) => {
          if (typeof emojiPickerCallback === 'function') {
            emojiPickerCallback(emoji);
          }
        }}
        guildEmojis={guildEmojis}
      />
    </div>
  );
}
