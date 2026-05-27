import React from 'react';
import { useTasks } from '../../context/TaskContext';
import './Pagination.css';

const Pagination = () => {
  const { pagination, filters, setPage } = useTasks();
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);

  return (
    <div className="pagination">
      <span className="pagination-info">Showing {start}–{end} of {total}</span>
      <div className="pagination-controls">
        <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
        {pages[0] > 1 && <><button className="btn btn-ghost btn-sm" onClick={() => setPage(1)}>1</button><span className="pagination-ellipsis">…</span></>}
        {pages.map(p => (
          <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)}>{p}</button>
        ))}
        {pages[pages.length - 1] < totalPages && <><span className="pagination-ellipsis">…</span><button className="btn btn-ghost btn-sm" onClick={() => setPage(totalPages)}>{totalPages}</button></>}
        <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default Pagination;
