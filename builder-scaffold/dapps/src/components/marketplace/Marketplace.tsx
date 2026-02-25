import React, { useState } from 'react';
import { Assembly } from '../../types/assembly';

interface Listing {
  id: string;
  storageId: string;
  itemType: string;
  amount: number;
  price: number;
  seller: string;
  timestamp: Date;
}

interface MarketplaceProps {
  storages: Assembly[];
  userBalance: string | null;
  onShowNotification?: (message: string) => void;
  onShowConfirmation?: (message: string, onConfirm: () => void) => void;
  onBalanceUpdate?: (newBalance: string) => void;
}

export function Marketplace({ 
  storages, 
  userBalance,
  onShowNotification,
  onShowConfirmation,
  onBalanceUpdate
}: MarketplaceProps) {
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      storageId: 'storage-main-001',
      itemType: 'fuel',
      amount: 1000,
      price: 50,
      seller: '0xf081...0308',
      timestamp: new Date()
    },
    {
      id: '2',
      storageId: 'storage-main-001',
      itemType: 'ore',
      amount: 500,
      price: 25,
      seller: '0xf081...0308',
      timestamp: new Date()
    },
    {
      id: '3',
      storageId: 'storage-main-001',
      itemType: 'components',
      amount: 50,
      price: 100,
      seller: '0xf081...0308',
      timestamp: new Date()
    }
  ]);
  
  const [newListing, setNewListing] = useState({
    itemType: '',
    amount: '',
    price: ''
  });

  const [inventory, setInventory] = useState({
    fuel: 5000,
    ore: 3000,
    components: 200,
    weapons: 50
  });

  // Convert balance from MIST to SUI for display
  const balance = userBalance ? Math.floor(parseInt(userBalance) / 1_000_000_000) : 0;
  const balanceMist = parseInt(userBalance || '0');

  const handleBuy = (listing: Listing) => {
    if (balance < listing.price) {
      onShowNotification?.(
        `Insufficient funds. Required: ${listing.price} EVE`
      );
      return;
    }

    const totalCost = listing.price;
    const totalCostMist = totalCost * 1_000_000_000;
    
    const confirmMessage = 
      `ITEM: ${listing.amount} ${listing.itemType}\n` +
      `PRICE: ${listing.price} EVE\n` +
      `TOTAL: ${totalCost} EVE\n\n` +
      `Confirm purchase?`;

    if (onShowConfirmation) {
      onShowConfirmation(confirmMessage, () => {
        // Calculate new balance in MIST
        const newBalanceMist = (balanceMist - totalCostMist).toString();
        
        // Update listings
        setListings(prev => prev.filter(l => l.id !== listing.id));
        
        // Update inventory
        setInventory(prev => ({
          ...prev,
          [listing.itemType]: (prev[listing.itemType as keyof typeof prev] || 0) + listing.amount
        }));

        // Update balance in parent component
        if (onBalanceUpdate) {
          onBalanceUpdate(newBalanceMist);
        }

        onShowNotification?.(
          `Acquired ${listing.amount} ${listing.itemType} for ${listing.price} EVE`
        );
      });
    }
  };

  const handleCreateListing = () => {
    if (!selectedStorage) {
      onShowNotification?.('Select a storage unit first');
      return;
    }
    
    const amount = parseInt(newListing.amount);
    const price = parseInt(newListing.price);
    
    if (!newListing.itemType) {
      onShowNotification?.('Select item type');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      onShowNotification?.('Enter valid amount');
      return;
    }
    if (isNaN(price) || price <= 0) {
      onShowNotification?.('Enter valid price');
      return;
    }

    const sellerInventory = inventory[newListing.itemType as keyof typeof inventory] || 0;
    if (sellerInventory < amount) {
      onShowNotification?.(`Insufficient ${newListing.itemType} in inventory`);
      return;
    }

    const confirmMessage = 
      `LISTING DETAILS:\n` +
      `ITEM: ${amount} ${newListing.itemType}\n` +
      `PRICE: ${price} EVE each\n` +
      `TOTAL VALUE: ${amount * price} EVE\n\n` +
      `Confirm listing?`;

    if (onShowConfirmation) {
      onShowConfirmation(confirmMessage, () => {
        const listing: Listing = {
          id: Date.now().toString(),
          storageId: selectedStorage,
          itemType: newListing.itemType,
          amount: amount,
          price: price,
          seller: '0xf081...0308',
          timestamp: new Date()
        };

        setListings(prev => [listing, ...prev]);
        
        setInventory(prev => ({
          ...prev,
          [newListing.itemType]: prev[newListing.itemType as keyof typeof prev] - amount
        }));

        setShowCreateListing(false);
        setNewListing({ itemType: '', amount: '', price: '' });
        
        onShowNotification?.(`Listed ${amount} ${newListing.itemType} for ${price} EVE`);
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setNewListing({...newListing, amount: value});
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setNewListing({...newListing, price: value});
    }
  };

  const filteredListings = selectedStorage
    ? listings.filter(l => l.storageId === selectedStorage)
    : listings;

  const getItemTypeName = (type: string) => {
    const names: Record<string, string> = {
      fuel: 'Fuel',
      ore: 'Ore',
      components: 'Components',
      weapons: 'Weapons'
    };
    return names[type] || type;
  };

  if (storages.length === 0) {
    return (
      <div className="eve-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No storage units found</p>
      </div>
    );
  }

  const selectedStorageData = storages.find(s => s.id === selectedStorage);

  return (
    <div className="eve-card" style={{ padding: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '1.5rem' 
      }}>
        <span style={{ fontSize: '1.5rem' }}>📦</span>
        <h2 className="eve-title" style={{ margin: 0, fontSize: '1.3rem' }}>
          CLAN MARKETPLACE
        </h2>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          Select Storage Unit:
        </label>
        <select
          value={selectedStorage || ''}
          onChange={(e) => setSelectedStorage(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
            fontFamily: 'Rajdhani, sans-serif'
          }}
        >
          <option value="">All Storage Units</option>
          {storages.map(storage => (
            <option key={storage.id} value={storage.id}>
              {storage.name} - {storage.itemCount || 0}/{storage.capacity || 100} items
            </option>
          ))}
        </select>
      </div>

      {selectedStorageData && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
              {selectedStorageData.name}
            </h3>
            <span style={{ 
              color: selectedStorageData.isOnline ? 'var(--status-online)' : 'var(--status-danger)'
            }}>
              {selectedStorageData.isOnline ? '● ONLINE' : '○ OFFLINE'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '4px'
          }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Capacity</div>
              <div style={{ fontWeight: 'bold' }}>
                {selectedStorageData.itemCount || 0} / {selectedStorageData.capacity || 100}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Value</div>
              <div style={{ fontWeight: 'bold', color: '#FF4700' }}>
                {selectedStorageData.value || 0} EVE
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setShowCreateListing(!showCreateListing)}
              className="eve-button"
              style={{ flex: 1 }}
            >
              {showCreateListing ? 'Cancel' : 'Create Listing'}
            </button>
          </div>

          {showCreateListing && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                New Listing
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.3rem', 
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    Item Type:
                  </label>
                  <select
                    value={newListing.itemType}
                    onChange={(e) => setNewListing({...newListing, itemType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select item...</option>
                    <option value="fuel">Fuel (You have: {inventory.fuel})</option>
                    <option value="ore">Ore (You have: {inventory.ore})</option>
                    <option value="components">Components (You have: {inventory.components})</option>
                    <option value="weapons">Weapons (You have: {inventory.weapons})</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.3rem', 
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    Amount:
                  </label>
                  <input
                    type="text"
                    value={newListing.amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.3rem', 
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    Price (EVE):
                  </label>
                  <input
                    type="text"
                    value={newListing.price}
                    onChange={handlePriceChange}
                    placeholder="Enter price"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <button
                  onClick={handleCreateListing}
                  className="eve-button"
                  disabled={!newListing.itemType || !newListing.amount || !newListing.price}
                >
                  Create Listing
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem'
        }}>
          Active Listings ({filteredListings.length})
        </h4>
        
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '4px',
          padding: '0.5rem'
        }}>
          {filteredListings.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'var(--text-muted)'
            }}>
              No active listings
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '0.5rem',
                padding: '0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span>Item</span>
                <span>Amount</span>
                <span>Price</span>
                <span>Seller</span>
                <span></span>
              </div>

              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.75rem 0.5rem',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <span>{getItemTypeName(listing.itemType)}</span>
                  <span>{listing.amount}</span>
                  <span style={{ color: '#FF4700', fontWeight: 'bold' }}>
                    {listing.price} EVE
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {listing.seller}
                  </span>
                  <button
                    onClick={() => handleBuy(listing)}
                    className="eve-button"
                    style={{ 
                      padding: '0.2rem 0.5rem', 
                      fontSize: '0.8rem',
                      backgroundColor: balance >= listing.price ? 'var(--accent-primary)' : 'var(--status-danger)',
                      opacity: balance >= listing.price ? 1 : 0.5
                    }}
                    disabled={balance < listing.price}
                  >
                    {balance >= listing.price ? 'Buy' : 'Insufficient'}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Your Inventory:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.9rem' }}>Fuel: <span style={{ color: '#FF4700' }}>{inventory.fuel}</span></div>
            <div style={{ fontSize: '0.9rem' }}>Ore: <span style={{ color: '#FF4700' }}>{inventory.ore}</span></div>
            <div style={{ fontSize: '0.9rem' }}>Components: <span style={{ color: '#FF4700' }}>{inventory.components}</span></div>
            <div style={{ fontSize: '0.9rem' }}>Weapons: <span style={{ color: '#FF4700' }}>{inventory.weapons}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
