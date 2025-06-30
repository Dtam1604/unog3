import { Card, CardColor, CardType } from '../types/Card';

// Create a complete UNO deck
export function createDeck(): Card[] {
  const cards: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  // Number cards (0-9)
  colors.forEach(color => {
    // One 0 per color
    cards.push({
      id: `${color}-0-${Math.random()}`,
      type: 'number',
      color,
      value: 0
    });
    
    // Two of each number 1-9 per color
    for (let num = 1; num <= 9; num++) {
      for (let i = 0; i < 2; i++) {
        cards.push({
          id: `${color}-${num}-${i}-${Math.random()}`,
          type: 'number',
          color,
          value: num
        });
      }
    }
  });
  
  // Standard action cards (2 per color)
  const actionTypes: CardType[] = ['skip', 'reverse', 'draw-two'];
  colors.forEach(color => {
    actionTypes.forEach(type => {
      for (let i = 0; i < 2; i++) {
        cards.push({
          id: `${color}-${type}-${i}-${Math.random()}`,
          type,
          color
        });
      }
    });
  });
  
  // Custom action cards (2 per color)
  const customActionTypes: CardType[] = ['swap-hands', 'draw-minus-two', 'shuffle-my-hand', 'block-all'];
  colors.forEach(color => {
    customActionTypes.forEach(type => {
      for (let i = 0; i < 2; i++) {
        cards.push({
          id: `${color}-${type}-${i}-${Math.random()}`,
          type,
          color
        });
      }
    });
  });
  
  // Wild cards (4 each)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `wild-${i}-${Math.random()}`,
      type: 'wild',
      color: 'wild'
    });
    
    cards.push({
      id: `wild-draw-four-${i}-${Math.random()}`,
      type: 'wild-draw-four',
      color: 'wild'
    });
  }
  
  return cards;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Enhanced function to ensure unlimited card supply
export function ensureDrawPileHasCards(drawPile: Card[], discardPile: Card[], topCard: Card, minCards: number = 1): { newDrawPile: Card[], newDiscardPile: Card[] } {
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];
  
  // If draw pile doesn't have enough cards, reshuffle from discard pile
  if (newDrawPile.length < minCards) {
    console.log(`🔄 Bộ bài rút có ${newDrawPile.length} lá, cần ${minCards}. Đang xáo trộn bộ bài bỏ...`);
    
    // Keep only the top card in discard pile, reshuffle the rest into draw pile
    const cardsToReshuffle = newDiscardPile.slice(0, -1); // All except the last card (top card)
    
    if (cardsToReshuffle.length > 0) {
      const reshuffledCards = shuffleDeck(cardsToReshuffle);
      newDrawPile = [...newDrawPile, ...reshuffledCards];
      newDiscardPile = [topCard]; // Keep only the current top card
      
      console.log(`✅ Đã xáo trộn ${cardsToReshuffle.length} lá bài. Bộ bài rút hiện có ${newDrawPile.length} lá.`);
    } else {
      // If even the discard pile is empty (shouldn't happen in normal play), create a new deck
      console.log(`⚠️ Cả bộ bài rút và bỏ đều trống. Đang tạo bộ bài mới...`);
      const newDeck = shuffleDeck(createDeck());
      
      // Remove any cards that might be identical to the top card to avoid conflicts
      const filteredDeck = newDeck.filter(card => 
        !(card.color === topCard.color && card.type === topCard.type && card.value === topCard.value)
      );
      
      newDrawPile = [...newDrawPile, ...filteredDeck];
      console.log(`✅ Đã thêm ${filteredDeck.length} lá bài mới vào bộ bài rút.`);
    }
  }
  
  return { newDrawPile, newDiscardPile };
}

export function canPlayCard(card: Card, topCard: Card, wildColor?: CardColor, stackingType?: 'none' | 'draw-two' | 'wild-draw-four'): boolean {
  // Special stacking rules
  if (stackingType && stackingType !== 'none') {
    if (stackingType === 'draw-two') {
      // Can stack +2 or +4 on +2
      return card.type === 'draw-two' || card.type === 'wild-draw-four';
    } else if (stackingType === 'wild-draw-four') {
      // Can only stack +4 on +4
      return card.type === 'wild-draw-four';
    }
  }
  
  // Wild cards can always be played (except when BlockAll is active, but that's checked elsewhere)
  if (card.type === 'wild' || card.type === 'wild-draw-four') {
    return true;
  }
  
  // If there's a wild color set (from previous wild card), ONLY match that color
  if (wildColor && wildColor !== 'wild') {
    console.log(`🎯 Màu đổi đang hoạt động: ${wildColor}, kiểm tra bài: ${card.color} ${card.type} ${card.value || ''}`);
    return card.color === wildColor;
  }
  
  // No wild color active - check normal UNO rules
  
  // 1. Match color
  if (card.color === topCard.color) {
    console.log(`✅ Trùng màu: ${card.color} khớp với ${topCard.color}`);
    return true;
  }
  
  // 2. Match number (only for number cards)
  if (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value) {
    console.log(`✅ Trùng số: ${card.value} khớp với ${topCard.value}`);
    return true;
  }
  
  // 3. Match action type (skip on skip, reverse on reverse, etc.)
  if (card.type === topCard.type && card.type !== 'number') {
    console.log(`✅ Trùng hành động: ${card.type} khớp với ${topCard.type}`);
    return true;
  }
  
  console.log(`❌ Không khớp: Bài(${card.color} ${card.type} ${card.value || ''}) vs Trên(${topCard.color} ${topCard.type} ${topCard.value || ''}) màuĐổi: ${wildColor || 'không'}`);
  return false;
}

export function getCardDisplayName(card: Card): string {
  if (card.type === 'number') {
    return card.value?.toString() || '0';
  }
  
  const typeNames: Record<CardType, string> = {
    'number': '',
    'skip': 'Bỏ qua',
    'reverse': 'Đảo chiều',
    'draw-two': 'Rút 2',
    'wild': 'Đổi màu',
    'wild-draw-four': 'Đổi màu +4',
    'swap-hands': 'Đổi bài',
    'draw-minus-two': 'Rút -2',
    'shuffle-my-hand': 'Xáo trộn',
    'block-all': 'Chặn'
  };
  
  return typeNames[card.type];
}

export function getCardSymbol(card: Card): string {
  const symbols: Record<CardType, string> = {
    'number': card.value?.toString() || '0',
    'skip': '⊘',
    'reverse': '↻',
    'draw-two': '+2',
    'wild': '★',
    'wild-draw-four': '+4',
    'swap-hands': '⇄',
    'draw-minus-two': '-2',
    'shuffle-my-hand': '🔄',
    'block-all': '🛡️'
  };
  
  return symbols[card.type];
}

// Helper function to validate if a card play is legal
export function validateCardPlay(card: Card, topCard: Card, wildColor?: CardColor, isBlockAllActive?: boolean, stackingType?: 'none' | 'draw-two' | 'wild-draw-four'): { valid: boolean; reason?: string } {
  // Check BlockAll restriction first
  if (isBlockAllActive && card.type !== 'number') {
    return { valid: false, reason: 'Chặn tất cả đang hoạt động - chỉ được đánh lá số' };
  }
  
  // Check stacking rules
  if (stackingType && stackingType !== 'none') {
    if (stackingType === 'draw-two') {
      if (card.type !== 'draw-two' && card.type !== 'wild-draw-four') {
        return { valid: false, reason: 'Phải chồng bài +2 hoặc +4, hoặc rút bài' };
      }
    } else if (stackingType === 'wild-draw-four') {
      if (card.type !== 'wild-draw-four') {
        return { valid: false, reason: 'Phải chồng bài +4, hoặc rút bài' };
      }
    }
  }
  
  // Check basic UNO rules
  if (!canPlayCard(card, topCard, wildColor, stackingType)) {
    if (wildColor && wildColor !== 'wild') {
      const colorNames = {
        'red': 'đỏ',
        'blue': 'xanh dương', 
        'green': 'xanh lá',
        'yellow': 'vàng'
      };
      return { valid: false, reason: `Phải khớp màu đổi: ${colorNames[wildColor as keyof typeof colorNames] || wildColor}` };
    } else {
      const colorNames = {
        'red': 'đỏ',
        'blue': 'xanh dương',
        'green': 'xanh lá', 
        'yellow': 'vàng'
      };
      const topCardColor = colorNames[topCard.color as keyof typeof colorNames] || topCard.color;
      const actionNames = {
        'skip': 'bỏ qua',
        'reverse': 'đảo chiều',
        'draw-two': 'rút 2',
        'wild': 'đổi màu',
        'wild-draw-four': 'đổi màu +4',
        'swap-hands': 'đổi bài',
        'draw-minus-two': 'rút -2',
        'shuffle-my-hand': 'xáo trộn',
        'block-all': 'chặn'
      };
      const topCardAction = actionNames[topCard.type as keyof typeof actionNames] || topCard.type;
      return { valid: false, reason: `Phải khớp màu (${topCardColor}), số (${topCard.value}), hoặc hành động (${topCardAction})` };
    }
  }
  
  return { valid: true };
}

// Check if a player can stack on current draw cards
export function canStackDrawCard(card: Card, stackingType: 'none' | 'draw-two' | 'wild-draw-four'): boolean {
  if (stackingType === 'none') return false;
  
  if (stackingType === 'draw-two') {
    return card.type === 'draw-two' || card.type === 'wild-draw-four';
  } else if (stackingType === 'wild-draw-four') {
    return card.type === 'wild-draw-four';
  }
  
  return false;
}