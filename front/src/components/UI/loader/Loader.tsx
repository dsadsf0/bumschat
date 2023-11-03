import React from 'react';
import { memo } from 'react';
import cl from './loader.module.scss';

const Loader: React.FC = memo(() => {
	return (
		<div className={cl.wrapper}>
			<div className={cl.loader}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
});
export default Loader;
