import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from "next/link";
import ContactUsForm from "@/components/ContactUsForm";

export default function ContactUs() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <Card className="h-full border-yellow-200 shadow-lg py-0 overflow-hidden">
                            <CardHeader className="bg-yellow-500 text-white py-4">
                                <CardTitle className="text-xl">Get in Touch</CardTitle>
                                <CardDescription className="text-yellow-100">
                                    We're here to help and answer any question you might have.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Address</p>
                                        <p className="text-gray-600">
                                            Dr.shyama Prashad Mukhrjee Nagar <br/>
                                            Building - G Flat no.504 <br/>
                                            Rajkot 360005.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Phone className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Phone</p>
                                        <Link href={'tel:+917623969483'} className="text-gray-600">+917623969483</Link>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Email</p>
                                        <Link href={'mailto:contactus@vistarastyles.com'} className="text-gray-600">contactus@vistarastyles.com</Link>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Business Hours</p>
                                        <p className="text-gray-600">
                                            Mon - Fri: 9:00 AM - 6:00 PM<br />
                                            Sat: 10:00 AM - 4:00 PM<br />
                                            Sun: Closed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <ContactUsForm />
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <Alert className="max-w-2xl mx-auto border-yellow-200 bg-yellow-50">
                        <AlertDescription className="text-gray-700">
                            <strong>Need immediate assistance?</strong> Call us at{' '}
                            <Link href={'tel:+917623969483'} className="text-yellow-600 font-semibold">+91 7623969483</Link> during business hours
                            for urgent inquiries.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    )
}