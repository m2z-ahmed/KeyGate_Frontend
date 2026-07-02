export default function NotFoundView({ go, page, navigate }) {
  return (
    <div className='not-found-view'>
      <div className='not-found-inner'>
        <div className='not-found-code'>404</div>
        <h2 className='not-found-title'>Page not found</h2>
        <p className='not-found-sub'>
          {page ? `"${page}" is not a valid page in this console.` : 'The page you are looking for does not exist.'}
        </p>
        <div className='not-found-actions'>
          <button className='btn btn-primary' onClick={() => navigate?.('overview')}>Go to Overview</button>
          <button className='btn btn-ghost' onClick={() => go?.('/console')}>Switch project</button>
        </div>
      </div>
    </div>
  );
}
