
import React from 'react';

export type Language = 'en' | 'bn' | 'hi';

export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  fullDesc: string;
}

export interface Product {
  id: string;
  img: string;
  title: string;
  details?: string;
  price?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
