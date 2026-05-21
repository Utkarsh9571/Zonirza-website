'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/imageResolver';

interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchReviews();
    }
  }, [status, session, router]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, status: newStatus as any } : r));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review forever?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-brand-text">Loading reviews...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-brand-text">Review Moderation</h1>
        <p className="text-brand-text/60 mt-2">Approve, reject, or manage customer product reviews.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-brand-text/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-bg/50 border-b border-brand-text/10">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-brand-text/50">Product</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-brand-text/50">Review</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-brand-text/50">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-brand-text/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/5">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-brand-bg/30 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-bg relative flex-shrink-0">
                        {review.product?.images?.[0] ? (
                          <Image src={resolveProductImage(review.product.images[0])} alt="Product" fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="max-w-[150px]">
                        <p className="font-bold text-brand-text truncate">{review.product?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-brand-text/50 uppercase truncate">{review.product?.slug}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-top max-w-md">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold">{review.userName}</span>
                      {review.isVerifiedPurchase && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Verified</span>}
                      <span className="text-brand-text/30 text-[10px]">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={star <= review.rating ? "fill-brand-gold text-brand-gold" : "text-brand-text/20"} />
                      ))}
                    </div>
                    <p className="font-bold text-sm mb-1">{review.title}</p>
                    <p className="text-brand-text/70 text-sm line-clamp-2" title={review.comment}>{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mt-2">
                        {review.images.map((img, i) => (
                          <div key={i} className="w-8 h-8 rounded overflow-hidden border border-brand-text/10 bg-brand-bg">
                            <img src={img} alt="review" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {review.status !== 'approved' && (
                        <button onClick={() => updateStatus(review._id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button onClick={() => updateStatus(review._id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                          <XCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => deleteReview(review._id)} className="p-1.5 text-brand-text/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2" title="Delete Permanently">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && (
            <div className="p-8 text-center text-brand-text/50">No reviews found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
