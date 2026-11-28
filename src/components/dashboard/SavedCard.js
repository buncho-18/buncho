import SavedPopup from '@/components/saved/SavedPopup';
import { Empty } from './Section';

/** Small card with a button that opens every saved question in a popup, grouped by category and topic. */
export default function SavedCard({ items }) {
  const count = items.length;

  return (
    <section id="saved" aria-labelledby="saved-h" className="card p-5 sm:p-6">
      <h2 id="saved-h" className="text-base font-semibold tracking-tight">Saved for later</h2>

      {count ? (
        <>
          <p className="mt-1 text-sm text-muted">{count} question{count === 1 ? '' : 's'} saved</p>
          <div className="mt-5">
            <SavedPopup variant="card" count={count} />
          </div>
        </>
      ) : (
        <div className="mt-5">
          <Empty>Use Save for later on any question to collect it here.</Empty>
        </div>
      )}
    </section>
  );
}