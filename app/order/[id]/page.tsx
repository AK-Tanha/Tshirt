import { MotionSection } from '@/components/MotionSection';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 return (
 <main className="max-w-md mx-auto px-4 pb-12 md:pb-24 text-center">
 <MotionSection>
 <h1 className="font-display text-4xl mb-6 text-navy">THANK YOU!</h1>
 <p className="font-body text-slate mb-8">Order #{id} received. We will call you soon to confirm.</p>
 </MotionSection>
 </main>
 );
}
