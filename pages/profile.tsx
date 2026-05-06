import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Head from 'next/head';

import Header from '../Components/Header';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest';
import axiosInstance from '../Utils/axiosConfig';
import { formatAmount } from '../Utils/formatAmount';
import { capitalizeFirstLetter } from '../Utils/capitalizeFirstLettersOfString';
import { updateUserAction } from '../requests/user/user.request';
import { filterOrderAction } from '../requests/order/order.request';
import {
  filterMyOrderTrainStatusAction,
  getMyOrderTrainAction,
} from '../requests/orderTrain/orderTrain.request';
import { statusType } from '../requests/orderTrain/orderTrain.types';

import UpdateAddressModal from '../Components/modals/address/UpdateAddressModal';
import NewAddressModal from '../Components/modals/address/NewAddressModal';
import DeleteAddressModal from '../Components/modals/address/DeleteAddressModal';
import ShowOrderModal from '../Components/modals/orders/ShowOrderModal';
import ShowOrderTrainModal from '../Components/modals/order-train/ShowOrderTrainModal';
import RateProductModal from '../Components/modals/pending-reviews/RateProductModal';

import {
  User, Package, MapPin, Star, Store,
  ChevronRight, MoreVertical, Plus, Train,
  Mail, Phone, Camera, Loader2, ShoppingBag,
  CheckCircle, Clock, Truck, XCircle, AlertCircle,
  Edit3, Trash2,
} from 'lucide-react';
import { processImgUrl } from '../Utils/helper';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface IProfilePageProps {
  profile: any;
  orders: any;
  orderTrains: any;
  addresses: any[];
  reviews: any;
}

/* ─── Nav tabs config ────────────────────────────────────────────────────── */
const NAV_TABS = [
  { key: 'profile', label: 'Profile',          icon: User    },
  { key: 'orders',  label: 'Orders',            icon: Package },
  { key: 'address', label: 'Addresses',         icon: MapPin  },
  { key: 'reviews', label: 'Pending Reviews',   icon: Star    },
] as const;
type NavKey = typeof NAV_TABS[number]['key'];

/* ─── Order status badge ─────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  completed:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: CheckCircle  },
  delivered:  { bg: 'bg-green-50',   text: 'text-green-700',   icon: Truck        },
  shipped:    { bg: 'bg-sky-50',    text: 'text-sky-700',    icon: Truck        },
  pending:    { bg: 'bg-amber-50',  text: 'text-amber-700',  icon: Clock        },
  unshipped:  { bg: 'bg-slate-50',  text: 'text-slate-600',  icon: AlertCircle  },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-600',    icon: XCircle      },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" />
      {capitalizeFirstLetter(status ?? 'pending')}
    </span>
  );
};

/* ─── Order filter statuses ──────────────────────────────────────────────── */
const ORDER_STATUSES = ['all', 'pending', 'shipped', 'delivered', 'completed', 'unshipped', 'cancelled'];

/* ─── Page ───────────────────────────────────────────────────────────────── */
function ProfilePage({ profile, orders, orderTrains, addresses, reviews }: IProfilePageProps) {
  const router = useRouter();
  const { path } = router.query;

  const [isLoading, setIsLoading]           = useState(false);
  const [savingProfile, setSavingProfile]   = useState(false);
  const [user, setUser]                     = useState<any>(profile);
  const [currentNav, setCurrentNav]         = useState<NavKey>((path?.toString() as NavKey) ?? 'profile');
  const [simpleOrdersData, setSimpleOrdersData] = useState(orders);
  const [orderTrainsData, setOrderTrainsData]   = useState(orderTrains);
  const [orderType, setOrderType]           = useState<'simple' | 'train'>('simple');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [isVendor, setIsVendor]             = useState(false);
  const [previewImage, setPreviewImage]     = useState<string | null>(null);

  /* Address modals */
  const [showNewAddressModal,    setShowNewAddressModal]    = useState(false);
  const [showEditAddressModal,   setShowEditAddressModal]   = useState(false);
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);
  const [selectedAddress,        setSelectedAddress]        = useState<any>({});
  const [openAddressMenuIdx,     setOpenAddressMenuIdx]     = useState<number | null>(null);

  /* Order modals */
  const [showViewOrderModal,      setShowViewOrderModal]      = useState(false);
  const [showViewOrderTrainModal, setShowViewOrderTrainModal] = useState(false);
  const [selectedOrder,           setSelectedOrder]           = useState<any>({});

  /* Review modal */
  const [showRateProductModal,   setShowRateProductModal]   = useState(false);
  const [selectedPendingReview,  setSelectedPendingReview]  = useState<any>({});

  /* ── handlers ── */
  const handleProfileChange = (e: any) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const selectImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUser({ ...user, picture: file, file_image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const setNav = (key: NavKey) => {
    setCurrentNav(key);
    Cookies.set('currentNav', key);
  };

  const updateUserProfile = async () => {
    setSavingProfile(true);
    updateUserAction({
      id: user.id, name: user.name, email: user.email,
      phone: user.phone, description: user.description,
      base64_image: user.base64_image, file_image: user.file_image,
    })
      .then((res) => { if (res.status === 202) toast.success('Profile updated'); })
      .catch(() => toast.error('Could not update profile'))
      .finally(() => setSavingProfile(false));
  };

  const filterSimpleOrders = async (status?: string) => {
    setIsLoading(true);
    filterOrderAction({ user_id: profile.id, status })
      .then((res) => {
        setSimpleOrdersData(res.data?.data);
        if (res.status === 204) toast.info('No orders with this status');
      })
      .catch(() => toast.error('Error filtering orders'))
      .finally(() => setIsLoading(false));
  };

  const filterOrderTrain = async (status?: string) => {
    setIsLoading(true);
    const action = status === 'all'
      ? getMyOrderTrainAction()
      : filterMyOrderTrainStatusAction({ status: status as statusType });
    action
      .then((res) => {
        setOrderTrainsData(res.data);
        if (res.status === 204) toast.info('No trains with this status');
      })
      .catch(() => toast.error('Error filtering trains'))
      .finally(() => setIsLoading(false));
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    orderType === 'simple' ? filterSimpleOrders(status) : filterOrderTrain(status);
  };

  useEffect(() => {
    const savedNav = Cookies.get('currentNav') as NavKey;
    const savedType = Cookies.get('orderType') as 'simple' | 'train';
    if (savedNav) setCurrentNav(savedNav);
    if (savedType) setOrderType(savedType);
    const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    if (!userCookie) router.push('/');
    if (userCookie?.vendor) setIsVendor(true);
  }, []);

  const simpleOrders = simpleOrdersData?.data ?? [];
  const trainOrders = orderTrainsData?.data ?? [];
  const currentOrders = orderType === 'simple' ? simpleOrders : trainOrders;

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>My Profile — Zuta</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header />

      {/* Modals */}
      {showEditAddressModal && (
        <UpdateAddressModal
          setShow={() => setShowEditAddressModal(false)}
          address={selectedAddress}
          redirect={() => router.push('/profile')}
        />
      )}
      {showDeleteAddressModal && (
        <DeleteAddressModal
          setShow={() => setShowDeleteAddressModal(false)}
          id={selectedAddress.id}
          redirect={() => router.push('/profile')}
        />
      )}
      {showNewAddressModal && (
        <NewAddressModal 
          setShow={() => setShowNewAddressModal(false)} 
          redirect={() => router.push('/profile')}  
        />
      )}
      {showViewOrderModal && (
        <ShowOrderModal setShow={() => setShowViewOrderModal(false)} order={selectedOrder} />
      )}
      {showViewOrderTrainModal && (
        <ShowOrderTrainModal
          setShow={() => setShowViewOrderTrainModal(false)}
          orderTrain={selectedOrder}
        />
      )}
      {showRateProductModal && (
        <RateProductModal
          order={selectedPendingReview.order}
          orderTrain={selectedPendingReview.openOrder}
          setShow={() => setShowRateProductModal(false)}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24">

        {/* ── PROFILE HEADER CARD ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 flex flex-col md:flex-row md:justify-between items-center sm:items-start gap-4">
          <div className='flex flex-row items-center gap-4'>
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-50 border-2 border-orange-100">
                <img
                  src={previewImage ?? user?.picture ?? 'https://via.placeholder.com/100'}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={selectImage}
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 sm:text-left">
              <p className="text-lg font-bold text-slate-800 capitalize leading-none mb-2">
                {user?.name}
              </p>
              <div className="flex flex-col gap-1 sm:gap-4 text-sm text-slate-400">
                <span className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Vendor badge */}
          {isVendor && (
            <button
              onClick={() => router.push('/vendor')}
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-600 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
            >
              <Store className="w-4 h-4" />
              My Store
            </button>
          )}
        </div>

        {/* ── TAB NAV ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          <div className="flex overflow-x-auto scrollbar-hide">
            {NAV_TABS.map(({ key, label, icon: Icon }) => {
              const active = currentNav === key;
              return (
                <button
                  key={key}
                  onClick={() => setNav(key)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-1 justify-center ${
                    active
                      ? 'border-orange-500 text-orange-600 bg-orange-50/60'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────────────────────── */}
        {currentNav === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              Personal information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Full name',     name: 'name',  value: user?.name,  placeholder: 'Your full name' },
                { label: 'Email address', name: 'email', value: user?.email, placeholder: 'your@email.com' },
                { label: 'Phone number',  name: 'phone', value: user?.phone, placeholder: '+234 000 0000' },
              ].map(({ label, name, value, placeholder }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={value ?? ''}
                    onChange={handleProfileChange}
                    placeholder={placeholder}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-50 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={updateUserProfile}
              disabled={savingProfile}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 transition-all text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
              Save changes
            </button>
          </div>
        )}

        {/* ── ORDERS TAB ───────────────────────────────────────────────────── */}
        {currentNav === 'orders' && (
          <div className="flex flex-col gap-4">

            {/* Order type toggle */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1 flex gap-1">
              {(['simple', 'train'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setOrderType(type);
                    Cookies.set('orderType', type);
                    setFilterStatus('all');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    orderType === type
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type === 'simple' ? (
                    <><ShoppingBag className="w-4 h-4" /> Regular orders</>
                  ) : (
                    <><Train className="w-4 h-4" /> Order trains</>
                  )}
                </button>
              ))}
            </div>

            {/* Status filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {ORDER_STATUSES.map((status) => {
                const active = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {/* Orders list */}
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="flex justify-center items-center py-16 gap-2 text-slate-400 bg-white rounded-2xl border border-slate-100">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading orders…</span>
                </div>
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order: any) => {
                  const isTrain = orderType === 'train';
                  const productName = order?.product_name ?? order?.product?.product_name ?? '—';
                  const qty = isTrain
                    ? (order?.pivot_quantity ?? order?.quantity)
                    : order?.quantity;
                  const pricePaid = isTrain
                    ? (order?.pivot_open_order_price_paid ?? order?.open_order_price_paid)
                    : order?.product_price_paid;
                  const total = isTrain
                    ? (order?.pivot_order_amount ?? order?.order_amount ?? (Number(order?.pivot_open_order_price_paid) * Number(order?.pivot_quantity)))
                    : order?.order_amount;
                  const status = isTrain
                    ? (order?.pivot_status ?? order?.status)
                    : order?.status;
                  const image = order?.product?.product_images?.[0] ?? order?.product_image;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        isTrain ? setShowViewOrderTrainModal(true) : setShowViewOrderModal(true);
                      }}
                    >
                      <div className="flex items-center gap-4 px-4 py-4">
                        {/* Product thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {image ? (
                            <img
                              src={processImgUrl(image)}
                              alt={productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {isTrain
                                ? <Train className="w-6 h-6 text-slate-300" />
                                : <Package className="w-6 h-6 text-slate-300" />
                              }
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-800 capitalize line-clamp-1">
                              {productName}
                            </p>
                            <StatusBadge status={status} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Qty: <strong className="text-slate-600">{qty}</strong></span>
                            <span>Unit: <strong className="text-slate-600">{formatAmount(pricePaid)}</strong></span>
                            <span>Total: <strong className="text-green-600 text-sm">{formatAmount(total)}</strong></span>
                          </div>
                          {order.id && (
                            <p className="text-[10px] text-slate-300 mt-0.5">
                              Order #{order.id}
                            </p>
                          )}
                          <span>
                            Date:{" "} 
                            <span className="text-slate-600">{new Date(order?.created_at || order?.createdAt).toDateString()}</span>
                          </span>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-slate-100">
                  {orderType === 'train'
                    ? <Train className="w-14 h-14 text-slate-200" />
                    : <ShoppingBag className="w-14 h-14 text-slate-200" />
                  }
                  <p className="text-slate-500 font-semibold">
                    No {filterStatus !== 'all' ? filterStatus : ''} {orderType === 'train' ? 'order trains' : 'orders'} yet
                  </p>
                  <button
                    onClick={() => router.push(orderType === 'train' ? '/order-train' : '/')}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-1"
                  >
                    {orderType === 'train' ? 'Browse order trains' : 'Start shopping'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADDRESSES TAB ────────────────────────────────────────────────── */}
        {currentNav === 'address' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewAddressModal(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add address
              </button>
            </div>

            {addresses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((address: any, index: number) => (
                  <div
                    key={address.id ?? index}
                    className={`bg-white rounded-2xl border ${address?.address_selected ? 'border-orange-600' : 'border-slate-100'} shadow-sm p-4 relative`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-orange-500" />
                        </div>
                        <p className="font-semibold text-xl text-slate-800 capitalize !mb-0">
                          {address?.title ?? 'Address'}
                        </p>
                        {
                          address?.address_selected ? (
                            <span className="text-orange-600 text-xs font-semibold italic">
                              (Default)
                            </span>
                          ) : null
                        }
                      </div>

                      {/* Context menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddress(address);
                            setOpenAddressMenuIdx(
                              openAddressMenuIdx === index ? null : index
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        {openAddressMenuIdx === index && (
                          <div className="absolute right-0 top-9 bg-white border border-slate-100 shadow-lg rounded-xl py-1 z-20 min-w-[120px]">
                            <button
                              onClick={() => {
                                setOpenAddressMenuIdx(null);
                                setShowEditAddressModal(true);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setOpenAddressMenuIdx(null);
                                setShowDeleteAddressModal(true);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 capitalize leading-relaxed">
                      {address?.name && <span className="block font-medium text-slate-700 capitalize">{address.name}</span>}
                      {address?.address}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-600">No saved addresses</p>
                  <p className="text-sm text-slate-400 mt-1">Add a delivery address to speed up checkout</p>
                </div>
                <button
                  onClick={() => setShowNewAddressModal(true)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add first address
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PENDING REVIEWS TAB ──────────────────────────────────────────── */}
        {currentNav === 'reviews' && (
          <div className="flex flex-col gap-3">
            {reviews?.data?.length ? (
              reviews.data.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={
                        review?.product?.product_images?.[0] ?
                        processImgUrl(review?.product?.product_images?.[0]) :
                        'https://via.placeholder.com/100'
                      }
                      alt={review?.product?.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 capitalize line-clamp-1 mb-0.5">
                      {review?.product?.product_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Order #{review?.order?.id ?? review?.openOrder?.id}
                    </p>
                    {review?.order?.delivered_on && (
                      <p className="text-xs text-slate-400">
                        Delivered{' '}
                        {new Date(review.order.delivered_on).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Rate button */}
                  <button
                    onClick={() => {
                      setSelectedPendingReview(review);
                      setShowRateProductModal(true);
                    }}
                    className="flex items-center gap-1.5 shrink-0 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 font-semibold text-xs px-3 py-2 rounded-xl transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Rate product
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Star className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-600">No pending reviews</p>
                <p className="text-sm text-slate-400">
                  Products you receive will appear here for rating
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile bottom nav hint */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 flex">
        {NAV_TABS.map(({ key, label, icon: Icon }) => {
          const active = currentNav === key;
          return (
            <button
              key={key}
              onClick={() => setNav(key)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
                active ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProfilePage;

/* ─── Server-side data fetching ──────────────────────────────────────────── */
export async function getServerSideProps(context: any) {
  const cookies = parse(context.req.headers.cookie || '');
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;

  try {
    const [
      myAddress, myProfile, myOrders,
      myOrderTrains, myReviews, myVendorAccount,
    ] = await Promise.allSettled([
      sendAxiosRequest('/api/address/me', 'get', {}, token, ''),
      sendAxiosRequest('/api/user/me', 'get', {}, token, ''),
      sendAxiosRequest('/api/order/me', 'get', {}, token, ''),
      axiosInstance.get('/api/open-order/me', { headers: { Authorization: token } }),
      sendAxiosRequest('/api/pending/reviews/me', 'get', {}, token, ''),
      axiosInstance.get('/api/vendor/me', { headers: { Authorization: token } }),
    ]);

    const val = (r: PromiseSettledResult<any>) =>
      r.status === 'fulfilled' ? r.value?.data ?? r.value : null;

    return {
      props: {
        addresses:   val(myAddress)   ?? [],
        profile:     val(myProfile)   ?? {},
        orders:      val(myOrders)    ?? [],
        orderTrains: val(myOrderTrains) ?? [],
        reviews:     val(myReviews)   ?? {},
        vendor:      val(myVendorAccount) ?? {},
      },
    };
  } catch (error: any) {
    console.error(error);
    if (error?.response?.status === 401) {
      return { redirect: { destination: '/auth/signIn', permanent: false } };
    }
    return {
      props: {
        addresses: [], profile: {}, orders: [],
        orderTrains: [], reviews: {}, vendor: {},
      },
    };
  }
}