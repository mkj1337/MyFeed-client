import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={'/signin'} replace />;
  }

  return children;
};

import { renderToString } from 'react-dom/server';

import _ from 'underscore';
export const generateRandomNum = (min: number, max: number): number =>
  _.shuffle([-1, 1])[0] * Math.floor(Math.random() * (max - min)) + min;

export const replaceMessage = (data: any = '') => {
  const hashtagReg = /(?<!\S)#(\w+)/g;
  const atReg = /(?<!\S)@[^\s\/]+/g;
  const linkReg =
    /\b(https?|ftp):\/\/[-A-Z0-9+\.\-\_\~\%\#\/?:&=()@%.]+[\s]?/gim;

  const navigateTo = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const message = data
    .replaceAll(hashtagReg, (match: any, hashtag: any) => {
      const link = renderToString(
        <a href={'/'} key={hashtag} className="hashtag" onClick={navigateTo}>
          {match}
        </a>
      );
      return link;
    })
    .replaceAll(atReg, (match: any, atSign: any) => {
      const username = match.split('@')[1];
      const link = renderToString(
        <a
          href={`/profile/${username}`}
          key={atSign}
          className="hashtag"
          onClick={navigateTo}
        >
          {match}
        </a>
      );
      return link;
    })
    .replaceAll(linkReg, (match: any, atSign: any) => {
      const value = match.split('/')[2];
      const link = renderToString(
        <a href={match} key={atSign} className="hashtag" target="_blank">
          {value}
        </a>
      );
      return link;
    });

  return message;
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
