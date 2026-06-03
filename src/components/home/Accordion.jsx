import { motion, AnimatePresence } from 'framer-motion';
import parse from 'html-react-parser';
import classNames from 'classnames';

export function Accordion({ title, description, isOpen, setTab }) {
  return (
    <div>
      <div
        onClick={() => setTab(title)}
        className={classNames(
          'w-full p-4 text-xl font-semibold text-start rounded-full cursor-pointer select-none',
          { 'bg-[#e7f1ff]': isOpen },
        )}
      >
        {title}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden px-4 text-[#717275] text-lg leading-10"
          >
            <div className="py-2">{parse(description)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
