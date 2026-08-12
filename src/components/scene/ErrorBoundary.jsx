"use client";

import { Component } from "react";

export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Sahna render xatosi:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
            Sahnani chizishda xatolik yuz berdi
          </p>
          <p className="mt-3 max-w-lg text-sm text-slate-300">
            {String(this.state.error?.message ?? this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-6 rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-navy"
          >
            Qayta urinish
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
