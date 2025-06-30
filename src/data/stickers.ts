import { Sticker } from '../types/Chat';

export const STICKERS: Sticker[] = [
  // Cảm xúc
  { id: 'happy', emoji: '😊', name: 'Vui vẻ', category: 'emotions' },
  { id: 'laugh', emoji: '😂', name: 'Cười', category: 'emotions' },
  { id: 'love', emoji: '😍', name: 'Yêu thích', category: 'emotions' },
  { id: 'cool', emoji: '😎', name: 'Ngầu', category: 'emotions' },
  { id: 'wink', emoji: '😉', name: 'Nháy mắt', category: 'emotions' },
  { id: 'sad', emoji: '😢', name: 'Buồn', category: 'emotions' },
  { id: 'angry', emoji: '😠', name: 'Tức giận', category: 'emotions' },
  { id: 'surprised', emoji: '😲', name: 'Ngạc nhiên', category: 'emotions' },

  // Phản ứng
  { id: 'thumbs-up', emoji: '👍', name: 'Thích', category: 'reactions' },
  { id: 'thumbs-down', emoji: '👎', name: 'Không thích', category: 'reactions' },
  { id: 'clap', emoji: '👏', name: 'Vỗ tay', category: 'reactions' },
  { id: 'fire', emoji: '🔥', name: 'Tuyệt vời', category: 'reactions' },
  { id: 'heart', emoji: '❤️', name: 'Trái tim', category: 'reactions' },
  { id: 'star', emoji: '⭐', name: 'Ngôi sao', category: 'reactions' },
  { id: 'thinking', emoji: '🤔', name: 'Suy nghĩ', category: 'reactions' },
  { id: 'facepalm', emoji: '🤦', name: 'Bó tay', category: 'reactions' },

  // Game
  { id: 'uno', emoji: '🎯', name: 'UNO!', category: 'game' },
  { id: 'cards', emoji: '🃏', name: 'Bài', category: 'game' },
  { id: 'winner', emoji: '🏆', name: 'Chiến thắng', category: 'game' },
  { id: 'lightning', emoji: '⚡', name: 'Tia chớp', category: 'game' },
  { id: 'bomb', emoji: '💣', name: 'Bom', category: 'game' },
  { id: 'target', emoji: '🎯', name: 'Mục tiêu', category: 'game' },
  { id: 'dice', emoji: '🎲', name: 'Xúc xắc', category: 'game' },
  { id: 'magic', emoji: '✨', name: 'Phép thuật', category: 'game' },

  // Vui nhộn
  { id: 'party', emoji: '🎉', name: 'Tiệc tùng', category: 'fun' },
  { id: 'rocket', emoji: '🚀', name: 'Tên lửa', category: 'fun' },
  { id: 'rainbow', emoji: '🌈', name: 'Cầu vồng', category: 'fun' },
  { id: 'unicorn', emoji: '🦄', name: 'Kỳ lân', category: 'fun' },
  { id: 'ghost', emoji: '👻', name: 'Ma', category: 'fun' },
  { id: 'alien', emoji: '👽', name: 'Người ngoài hành tinh', category: 'fun' },
  { id: 'robot', emoji: '🤖', name: 'Robot', category: 'fun' },
  { id: 'pizza', emoji: '🍕', name: 'Pizza', category: 'fun' }
];

export const STICKER_CATEGORIES = [
  { id: 'emotions', name: 'Cảm xúc', icon: '😊' },
  { id: 'reactions', name: 'Phản ứng', icon: '👍' },
  { id: 'game', name: 'Game', icon: '🎯' },
  { id: 'fun', name: 'Vui nhộn', icon: '🎉' }
] as const;