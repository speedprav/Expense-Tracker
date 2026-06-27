import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, User, ArrowUpRight, ArrowDownRight, History, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Ledger() {
  const { t } = useTranslation();
  const { people, addPerson, updatePersonBalance, profile } = useAppContext();
  const currency = profile.currency || '₹';
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  
  const [showTxModal, setShowTxModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txType, setTxType] = useState('give'); 
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyPerson, setHistoryPerson] = useState(null);
  
  const [duplicatePerson, setDuplicatePerson] = useState(null);

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName) return;
    
    // Check for duplicate name (case insensitive)
    const existing = people.find(p => p.name.toLowerCase() === newPersonName.toLowerCase());
    if (existing) {
      setDuplicatePerson(existing);
      return;
    }
    
    addPerson({ name: newPersonName });
    setNewPersonName('');
    setShowAddModal(false);
    setDuplicatePerson(null);
  };

  const openTransactionForExisting = () => {
    setShowAddModal(false);
    setSelectedPerson(duplicatePerson);
    setTxType('give');
    setShowTxModal(true);
    setNewPersonName('');
    setDuplicatePerson(null);
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    if (!txAmount || !selectedPerson) return;
    const amount = Number(txAmount);
    const finalAmount = txType === 'give' ? amount : -amount;
    updatePersonBalance(selectedPerson.id, finalAmount, txDescription || (txType === 'give' ? 'Given' : 'Taken'));
    setShowTxModal(false);
    setTxAmount('');
    setTxDescription('');
    setSelectedPerson(null);
  };

  const openHistory = (person) => {
    setHistoryPerson(person);
    setShowHistoryModal(true);
  };

  return (
    <div className="container animate-fade-in mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{t('Shared Ledger')}</h1>
          <p className="text-muted">{t('Keep track of who owes who')}</p>
        </div>
        <button className="btn btn-primary shadow-neon" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> {t('Add Person')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map(person => (
          <div key={person.id} className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-black bg-opacity-40 p-3 rounded-full border border-gray-800">
                  <User size={24} className="text-primary" />
                </div>
                <h3 className="font-bold text-xl">{person.name}</h3>
              </div>
              <button 
                onClick={() => openHistory(person)}
                className="p-2 bg-gray-800 bg-opacity-50 hover:bg-gray-700 rounded-full text-muted transition-colors"
                title={t('View History')}
              >
                <History size={18} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                {person.balance > 0 ? t("Owes you:") : person.balance < 0 ? t("You owe them:") : t("Settled up")}
              </p>
              <p className={`text-3xl font-bold ${person.balance > 0 ? 'text-success' : person.balance < 0 ? 'text-danger' : 'text-gray-400'}`}>
                {currency}{Math.abs(person.balance).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                className="btn btn-outline flex-1 text-sm py-2"
                onClick={() => { setSelectedPerson(person); setTxType('give'); setShowTxModal(true); }}
              >
                <ArrowUpRight size={16} /> {t('I Gave')}
              </button>
              <button 
                className="btn btn-outline flex-1 text-sm py-2"
                onClick={() => { setSelectedPerson(person); setTxType('take'); setShowTxModal(true); }}
              >
                <ArrowDownRight size={16} /> {t('I Took')}
              </button>
            </div>
          </div>
        ))}
        {people.length === 0 && (
          <div className="col-span-full text-center p-12 text-muted border border-dashed border-gray-800 rounded-2xl glass-panel-no-hover">
            <User size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">{t('No people added yet')}</p>
            <p className="text-sm">{t('Add someone to start tracking debts.')}</p>
          </div>
        )}
      </div>

      {/* Add Person Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-up">
          <div className="glass-panel-no-hover p-8 w-full max-w-sm relative">
            <h2 className="text-2xl font-bold mb-6 text-white">{t('Add Person')}</h2>
            <form onSubmit={handleAddPerson}>
              <div className="form-group mb-6">
                <label className="form-label">{t('Name')}</label>
                <input type="text" required className="form-input" value={newPersonName} onChange={e => { setNewPersonName(e.target.value); setDuplicatePerson(null); }} placeholder="e.g. John Doe" />
              </div>
              
              {duplicatePerson && (
                <div className="mb-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
                  <p className="text-warning text-sm font-bold mb-2">{t('This person already exists!')}</p>
                  <p className="text-xs text-gray-300 mb-3">"{duplicatePerson.name}" {t('is already in your ledger. Would you like to add a transaction for them instead?')}</p>
                  <button type="button" onClick={openTransactionForExisting} className="btn w-full bg-yellow-500 bg-opacity-20 hover:bg-opacity-30 text-warning text-sm py-2">
                    {t('Add Transaction to')} {duplicatePerson.name}
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" className="btn btn-outline flex-1" onClick={() => { setShowAddModal(false); setDuplicatePerson(null); setNewPersonName(''); }}>{t('Cancel')}</button>
                <button type="submit" className="btn btn-primary flex-1 shadow-neon">{t('Save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTxModal && selectedPerson && (
        <div className="modal-overlay animate-fade-up">
          <div className="glass-panel-no-hover p-8 w-full max-w-sm relative">
            <h2 className="text-2xl font-bold mb-2 text-white">
              {txType === 'give' ? t('Gave money') : t('Took money')}
            </h2>
            <p className="text-muted mb-6">{t('to/from')} {selectedPerson.name}</p>
            <form onSubmit={handleTransaction}>
              <div className="form-group mb-4">
                <label className="form-label">{t('Amount')} ({currency})</label>
                <input type="number" required className="form-input text-xl font-bold" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group mb-8">
                <label className="form-label">{t('Description (Optional)')}</label>
                <input type="text" className="form-input" value={txDescription} onChange={e => setTxDescription(e.target.value)} placeholder="e.g. Lunch money" />
              </div>
              <div className="flex gap-4">
                <button type="button" className="btn btn-outline flex-1" onClick={() => setShowTxModal(false)}>{t('Cancel')}</button>
                <button type="submit" className="btn btn-primary flex-1 shadow-neon">{t('Save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && historyPerson && (
        <div className="modal-overlay animate-fade-in">
          <div className="glass-panel w-full max-w-md relative flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black bg-opacity-40 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-white">{historyPerson.name}{t("'s History")}</h2>
                <p className="text-sm text-muted">
                  {t('Current Balance:')} <span className={`font-bold ${historyPerson.balance > 0 ? 'text-success' : historyPerson.balance < 0 ? 'text-danger' : 'text-gray-400'}`}>
                    {historyPerson.balance > 0 ? '+' : historyPerson.balance < 0 ? '-' : ''}{currency}{Math.abs(historyPerson.balance).toLocaleString('en-IN')}
                  </span>
                </p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {!historyPerson.transactions || historyPerson.transactions.length === 0 ? (
                <div className="text-center py-10 text-muted opacity-60">
                  <p>{t('No transaction history found.')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {historyPerson.transactions.slice().reverse().map((tx, idx) => (
                    <div key={tx.id || idx} className="p-3 bg-gray-900 bg-opacity-60 rounded-lg flex justify-between items-center border border-gray-800 hover:bg-gray-800 transition-colors">
                      <div>
                        <p className="font-medium text-gray-200">{tx.description}</p>
                        <p className="text-[10px] text-muted mt-1">{new Date(tx.date).toLocaleString()}</p>
                      </div>
                      <div className={`font-bold ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {tx.amount > 0 ? '+' : '-'}{currency}{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
