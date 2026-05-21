'use client';

import React, { useEffect, useState } from 'react';
import { Section } from './Section';
import { Star, ThumbsUp, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]); // For future image upload support

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Please log in to submit a review');
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, comment, images })
      });
      const json = await res.json();
      if (json.success) {
        alert('Review submitted successfully and is pending approval.');
        setShowModal(false);
        setTitle('');
        setComment('');
        setRating(5);
      } else {
        alert(json.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <Section className="!py-20 bg-brand-bg dark:bg-[#1a1614] transition-colors border-t border-brand-text/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Customer Reviews</h2>
          <div className="w-16 h-px bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Stats & CTA */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-brand-bg rounded-3xl p-8 shadow-premium border border-brand-text/5 dark:border-white/5">
              <div className="flex flex-col items-center justify-center space-y-2 border-b border-brand-text/10 pb-6 mb-6">
                <span className="text-5xl font-serif font-bold text-brand-gold">{averageRating}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} className={cn(star <= Number(averageRating) ? "fill-brand-gold text-brand-gold" : "text-brand-text/20")} />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-brand-text/50 pt-2">Based on {reviews.length} reviews</span>
              </div>
              
              <div className="space-y-3 mb-8">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center space-x-3 text-sm">
                      <span className="w-4 text-brand-text/60">{star}</span>
                      <Star size={12} className="text-brand-gold fill-brand-gold flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-brand-text/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-gold rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-brand-text/60 text-xs">{count}</span>
                    </div>
                  );
                })}
              </div>

              <Button 
                onClick={() => setShowModal(true)}
                className="w-full !py-4 shadow-soft border-brand-text dark:border-brand-gold text-white bg-brand-text dark:bg-brand-gold hover:bg-opacity-90"
              >
                Write a Review
              </Button>
            </div>
          </div>

          {/* Right Column: Review List */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white dark:bg-brand-bg rounded-3xl p-12 text-center shadow-soft border border-brand-text/5 dark:border-white/5">
                <MessageSquare size={48} className="mx-auto text-brand-text/20 mb-4" />
                <h3 className="text-xl font-serif text-brand-text mb-2">No Reviews Yet</h3>
                <p className="text-brand-text/60 text-sm">Be the first to review this stunning piece.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white dark:bg-brand-bg rounded-3xl p-8 shadow-soft border border-brand-text/5 dark:border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-bold text-brand-text">{review.userName}</h4>
                          {review.isVerifiedPurchase && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] uppercase tracking-wider font-bold">Verified Buyer</span>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className={cn(star <= review.rating ? "fill-brand-gold text-brand-gold" : "text-brand-text/20")} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-text/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h5 className="font-bold text-brand-text mb-2 text-sm">{review.title}</h5>
                    <p className="text-brand-text/70 text-sm leading-relaxed mb-4">{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mt-4">
                        {review.images.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-brand-text/10">
                            <img src={img} alt="Review upload" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-text/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1a1614] rounded-[40px] p-8 md:p-12 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-brand-text/50 hover:text-brand-text">✕</button>
            <h3 className="text-2xl font-serif text-brand-text mb-6">Write a Review</h3>
            
            {!session ? (
              <div className="text-center py-8">
                <p className="text-brand-text/70 mb-6">You must be logged in to write a review.</p>
                <Button onClick={() => window.location.href='/login'} className="w-full bg-brand-gold text-white hover:bg-opacity-90">Login to Review</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-text/60 font-bold mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                        <Star size={28} className={cn(star <= rating ? "fill-brand-gold text-brand-gold" : "text-brand-text/20 hover:text-brand-gold/50")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-text/60 font-bold mb-2">Title</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-brand-text/10 dark:border-white/10 bg-transparent text-brand-text focus:outline-none focus:border-brand-gold transition-colors" placeholder="Sum up your experience" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-text/60 font-bold mb-2">Review</label>
                  <textarea required value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-brand-text/10 dark:border-white/10 bg-transparent text-brand-text focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="Share the details of your experience..."></textarea>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={submitLoading} className="w-full !py-4 bg-brand-gold text-white hover:bg-opacity-90 disabled:opacity-50">
                    {submitLoading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};
