import React, { useState, useEffect } from 'react';
import { Card, CardColor } from './types/Card';
import { useGameState } from './hooks/useGameState';
import { useRoomSystem } from './hooks/useRoomSystem';
import { useChatSystem } from './hooks/useChatSystem';
import { canPlayCard, validateCardPlay, canStackDrawCard } from './utils/cardUtils';
import { socketService } from './services/SocketService';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import GameStatus from './components/GameStatus';
import RoomBrowser from './components/RoomSystem/RoomBrowser';
import RoomLobby from './components/RoomSystem/RoomLobby';
import ChatPanel from './components/Chat/ChatPanel';

type AppState = 'room-browser' | 'room-lobby' | 'game';

function App() {
  const [appState, setAppState] = useState<AppState>('room-browser');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Room system
  const {
    currentRoom,
    currentPlayerId,
    isHost,
    activeRooms,
    loading,
    error,
    isConnected,
    gameState: roomGameState,
    createRoom,
    joinRoom,
    leaveRoom,
    kickPlayer,
    startGame,
    restartGame,
    toggleReady,
    loadActiveRooms,
    clearError,
    playCard: roomPlayCard,
    drawCard: roomDrawCard,
    callUno: roomCallUno,
    handleStackedDraw: roomHandleStackedDraw
  } = useRoomSystem();

  // Local game state (fallback for single player)
  const { 
    gameState: localGameState, 
    drawCard: localDrawCard, 
    playCard: localPlayCard, 
    callUno: localCallUno, 
    resetGame,
    handleStackedDraw: localHandleStackedDraw
  } = useGameState();

  // Chat system
  const {
    messages,
    isOpen: isChatOpen,
    sendMessage,
    sendSticker,
    toggleChat,
    addMessage,
    clearMessages
  } = useChatSystem(
    currentRoom?.id || null,
    currentPlayerId,
    currentRoom?.players.find(p => p.id === currentPlayerId)?.name || 'Không rõ'
  );

  // Use room game state if in multiplayer, otherwise use local game state
  const gameState = roomGameState || localGameState;
  const playCard = roomGameState ? roomPlayCard : localPlayCard;
  const drawCard = roomGameState ? roomDrawCard : localDrawCard;
  const callUno = roomGameState ? roomCallUno : localCallUno;
  const handleStackedDraw = roomGameState ? roomHandleStackedDraw : localHandleStackedDraw;
  const isMultiplayer = !!roomGameState;

  // Setup chat event listeners
  useEffect(() => {
    const unsubscribe = socketService.addChatEventListener((message) => {
      addMessage(message);
    });

    return unsubscribe;
  }, [addMessage]);

  // Handle room events
  useEffect(() => {
    if (currentRoom) {
      if (currentRoom.gameInProgress && appState !== 'game') {
        setAppState('game');
      } else if (!currentRoom.gameInProgress && appState === 'game') {
        setAppState('room-lobby');
      } else if (appState === 'room-browser') {
        setAppState('room-lobby');
      }
    } else {
      setAppState('room-browser');
      clearMessages(); // Clear chat when leaving room
    }
  }, [currentRoom, appState, clearMessages]);

  // Room system handlers
  const handleCreateRoom = async (data: any) => {
    const result = await createRoom(data);
    return result;
  };

  const handleJoinRoom = async (data: any) => {
    const result = await joinRoom(data);
    return result;
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setAppState('room-browser');
  };

  const handleStartGame = async () => {
    const success = await startGame();
    if (success) {
      setAppState('game');
    }
  };

  // Game handlers
  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId) || gameState.players.find(p => p.isHuman);
  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer?.id);
  const isCurrentPlayerTurn = gameState.players[gameState.currentPlayerIndex]?.id === currentPlayer?.id;

  // Enhanced playable cards validation with stacking support
  const playableCards = currentPlayer ? currentPlayer.cards.filter(card => {
    // If stacking is active, only allow stacking cards
    if (gameState.stackingType !== 'none') {
      return canStackDrawCard(card, gameState.stackingType);
    }
    
    // Normal validation
    const validation = validateCardPlay(card, gameState.topCard, gameState.wildColor, gameState.isBlockAllActive, gameState.stackingType);
    return validation.valid;
  }) : [];

  const handleCardClick = (card: Card) => {
    if (!isCurrentPlayerTurn) {
      console.log('❌ Không phải lượt của bạn!');
      return;
    }
    
    // Validate card play before allowing selection
    const validation = validateCardPlay(card, gameState.topCard, gameState.wildColor, gameState.isBlockAllActive, gameState.stackingType);
    if (!validation.valid) {
      console.log('❌ Không thể đánh lá bài này:', validation.reason);
      return;
    }

    if (card.type === 'wild' || card.type === 'wild-draw-four') {
      setSelectedCard(card);
      setShowColorPicker(true);
    } else {
      console.log('✅ Đánh bài:', `${card.color} ${card.type} ${card.value || ''}`);
      playCard(currentPlayer!.id, card);
      setSelectedCard(null);
    }
  };

  const handleColorChoice = (color: CardColor) => {
    if (selectedCard && currentPlayer) {
      console.log('✅ Đánh lá bài đổi màu với màu:', color);
      playCard(currentPlayer.id, selectedCard, color);
      setSelectedCard(null);
    }
    setShowColorPicker(false);
  };

  const handleDrawCard = () => {
    if (isCurrentPlayerTurn && currentPlayer) {
      console.log('📥 Rút bài cho:', currentPlayer.name);
      
      // If stacking is active, handle stacked draw instead
      if (gameState.stackingType !== 'none') {
        console.log('💥 Xử lý rút bài chồng thay vì rút bài thường');
        handleStackedDraw();
        return;
      }
      
      // Check if player has any playable cards
      if (playableCards.length === 0) {
        // No playable cards - draw one card and pass turn
        console.log('🎯 Không có bài có thể đánh - rút 1 lá và chuyển lượt');
        drawCard(currentPlayer.id, 1);
      } else {
        // Has playable cards but chose to draw - just draw without passing turn
        console.log('🎯 Người chơi chọn rút bài dù có bài có thể đánh');
        drawCard(currentPlayer.id, 1);
      }
    }
  };

  const handleUnoCall = () => {
    if (currentPlayer) {
      callUno(currentPlayer.id);
    }
  };

  const handleGameRestart = async () => {
    if (isMultiplayer) {
      if (isHost) {
        // Host restarts the game - go back to lobby
        const success = await restartGame();
        if (success) {
          setAppState('room-lobby');
        }
      }
    } else {
      // In single player, reset local game
      resetGame();
      setSelectedCard(null);
      setShowColorPicker(false);
    }
  };

  // Render based on app state
  if (appState === 'room-browser') {
    return (
      <RoomBrowser
        activeRooms={activeRooms}
        loading={loading}
        error={error}
        isConnected={isConnected}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onRefresh={loadActiveRooms}
        onClearError={clearError}
      />
    );
  }

  if (appState === 'room-lobby' && currentRoom && currentPlayerId) {
    return (
      <>
        <RoomLobby
          room={currentRoom}
          currentPlayerId={currentPlayerId}
          isHost={isHost}
          onLeaveRoom={handleLeaveRoom}
          onKickPlayer={kickPlayer}
          onStartGame={handleStartGame}
          onToggleReady={toggleReady}
        />
        
        {/* Chat in lobby */}
        <ChatPanel
          messages={messages}
          currentPlayerId={currentPlayerId}
          currentPlayerName={currentRoom.players.find(p => p.id === currentPlayerId)?.name || 'Không rõ'}
          onSendMessage={sendMessage}
          onSendSticker={sendSticker}
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />
      </>
    );
  }

  // Game view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
            UNO Trực Tuyến
          </h1>
          <p className="text-white/70 text-lg">
            {currentRoom ? `Phòng: ${currentRoom.name}` : 'Trải nghiệm game bài cổ điển với tính năng nâng cao'}
          </p>
          {!isConnected && isMultiplayer && (
            <div className="mt-2 text-red-300 text-sm">
              ⚠️ Mất kết nối server - Game có thể không hoạt động bình thường
            </div>
          )}
          {isMultiplayer && (
            <div className="mt-2 text-blue-300 text-sm">
              {isHost ? '👑 Bạn là Chủ phòng - Quản lý trạng thái game' : '👥 Đang đồng bộ với Chủ phòng'}
            </div>
          )}
        </div>

        {/* Game Status */}
        <div className="mb-6">
          <GameStatus 
            gameState={gameState}
            onUnoCall={handleUnoCall}
            onRestart={handleGameRestart}
            isMultiplayer={isMultiplayer}
            isHost={isHost}
          />
        </div>

        {/* Other Players */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {otherPlayers.map(player => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrentPlayer={gameState.players[gameState.currentPlayerIndex]?.id === player.id}
              playableCards={[]}
              isOwnPlayer={false} // Always false for other players - hide their cards
            />
          ))}
        </div>

        {/* Game Board */}
        <div className="mb-8">
          <GameBoard
            gameState={gameState}
            onDrawCard={handleDrawCard}
            onColorChoice={handleColorChoice}
            showColorPicker={showColorPicker}
            onHandleStackedDraw={handleStackedDraw}
          />
        </div>

        {/* Current Player Hand */}
        {currentPlayer && (
          <PlayerHand
            player={currentPlayer}
            isCurrentPlayer={isCurrentPlayerTurn}
            playableCards={playableCards}
            onCardClick={handleCardClick}
            selectedCard={selectedCard}
            isOwnPlayer={true} // Show actual cards for own hand
          />
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Cách chơi:</h3>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Ghép bài theo màu, số hoặc ký hiệu</li>
            <li>• Sử dụng lá bài hành động một cách chiến thuật (Bỏ qua, Đảo chiều, Rút 2, v.v.)</li>
            <li>• Gọi UNO khi còn 1 lá bài</li>
            <li>• Lá bài mới: Đổi bài, Rút trừ 2, Xáo trộn, Chặn tất cả</li>
            <li>• <strong>Cộng bài:</strong> +2 có thể cộng với +2 hoặc +4, +4 chỉ cộng với +4</li>
            <li>• <strong>Loại bỏ:</strong> Người chơi có 35+ bài sẽ bị loại khỏi game</li>
            <li>• <strong>Rút bài vô hạn:</strong> Bộ bài tự động xáo trộn khi hết, không giới hạn số lượng bài có thể rút</li>
            <li>• Người đầu tiên hết bài thắng cuộc!</li>
            {isMultiplayer && (
              <>
                <li>• <strong>Nhiều người chơi:</strong> Chủ phòng quản lý game, tất cả hành động được đồng bộ</li>
                <li>• <strong>Thời gian thực:</strong> Mọi người chơi cùng một trận game</li>
                <li>• <strong>Kiểm tra:</strong> Chỉ có thể đánh bài hợp lệ theo luật UNO</li>
                <li>• <strong>Trò chuyện & Biểu tượng:</strong> Trò chuyện và gửi biểu tượng cảm xúc trong game</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Chat Panel - Only show in multiplayer */}
      {isMultiplayer && currentRoom && currentPlayerId && (
        <ChatPanel
          messages={messages}
          currentPlayerId={currentPlayerId}
          currentPlayerName={currentRoom.players.find(p => p.id === currentPlayerId)?.name || 'Không rõ'}
          onSendMessage={sendMessage}
          onSendSticker={sendSticker}
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />
      )}
    </div>
  );
}

export default App;